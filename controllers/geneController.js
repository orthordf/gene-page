const fs = require('fs');
const Papa = require('papaparse');
const { Op } = require('sequelize');
const { GeneInfo, HomologeneSpecies, Species, Gene2RefSeq } = require('../sequelize/models');
const createError = require('http-errors');

async function getGeneInfo(geneId) {
  let geneInfo = await GeneInfo.findOne({ where: { id: geneId } });
  geneInfo = geneInfo.dataValues;
  let symbol = '',
    description = '';
  symbol = geneInfo['symbol'];
  description = geneInfo['description'];
  return [symbol, description, geneInfo];
}

async function getRefseqInfo(geneId, seed) {
  let refseqStatusTable = {};
  let records = await Gene2RefSeq.findAll({ where: { gene_id: geneId } });
  for (let row of records) {
    row = row.dataValues;
    let RNAVersion = row['rna_nucleotide_accession_version'];
    let ProteinVersion = row['protein_accession_version'];
    let status = row['status'];
    if (RNAVersion !== '-' || ProteinVersion !== '-') {
      refseqStatusTable[status] ||= {};
      refseqStatusTable[status][RNAVersion] ||= new Set();
      refseqStatusTable[status][RNAVersion].add(ProteinVersion);
      seed[ProteinVersion] = 1; // TODO: What does '1' mean?
    }
  }
  return refseqStatusTable;
}

// Return list of homologene and list of species with isHomologene flag
async function getHomologenes(groupId) {
  let species = await HomologeneSpecies.findAll({ order: ['sp_order'] });
  species = species.map((r) => {
    let data = r.dataValues;
    data.isHomologene = false;
    return data;
  });
  if (!groupId) {
    return [[], species];
  }
  let records = await GeneInfo.findAll({ where: { group_id: groupId }, include: HomologeneSpecies, order: [[HomologeneSpecies, 'sp_order', 'ASC']] });
  let homologene = records.map((r) => r.dataValues);

  homologene.forEach((gene) => {
    for (let s of species) {
      if (s.id == gene.tax_id) {
        s.isHomologene = true;
        break;
      }
    }
  });
  return [homologene, species];
}

async function currentTaxonomyAndCandidates(taxId) {
  let candidates = (await Species.findAll({ order: ['sp_order'] })).map((r) => r.dataValues);
  currentTaxonomy = candidates.find((r) => r.id == taxId);
  return {
    currentTaxonomy,
    taxonomyCandidates: candidates
  };
}

async function getBlastScores(symbol) {
  let filePath = `gene_data/blast.scores/${symbol}.scores.txt`;
  if (!fs.existsSync(filePath)) return [null, null];
  fileContent = fs.readFileSync(filePath).toString();
  let blastRecords = Papa.parse(fileContent, { skipEmptyLines: true });

  let targetMap = {};
  let reverseBestsProteins = [];

  blastScores = blastRecords.data.map((record) => {
    let scoreDict = {
      speciesIndex: record[0],
      query: record[1],
      target: record[2],
      score: record[4],
      description: record[5],
      isBBH: record[6] == 1,
      ratio: record[8],
      reverseBests: record[9]?.split(' ')
    };
    reverseBestsProteins = reverseBestsProteins.concat(scoreDict.reverseBests);
    targetMap[record[2]] = scoreDict;
    return scoreDict;
  });

  targetSymbols = await Gene2RefSeq.findAll({ where: { protein_accession_version: blastScores.map((r) => r.target) }, include: GeneInfo });

  targetSymbols.forEach((r) => {
    let scoreRecord = targetMap[r.dataValues.protein_accession_version];
    scoreRecord.targetSymbol = r.dataValues.symbol;
    scoreRecord.targetGeneID = r.dataValues.gene_id;
    scoreRecord.targetGroupID = r.GeneInfo?.group_id;
  });

  let reverseBestsRecords = await Gene2RefSeq.findAll({ where: { protein_accession_version: reverseBestsProteins }, include: GeneInfo });

  let reverseBestsDict = {};
  reverseBestsRecords.forEach((r) => {
    reverseBestsDict[r.dataValues.protein_accession_version] = r.dataValues.symbol;
  });

  return [blastScores, reverseBestsDict];
}

const geneController = {
  async index(req, res, next) {
    let query = req.query.query || '';
    const searchMode = req.query.searchMode;
    const page = parseInt(req.query.page) || 1;
    const taxId = parseInt(req.query.taxId) || req.cookies.taxId || 9606;
    const limit = 100;
    const offset = (page - 1) * limit;
    const where = {
      tax_id: taxId
    };
    res.cookie('taxId', taxId, {
      httpOnly: false
    });
    if (query) {
      // If query starts with '^', perform forward match
      let patternString = query.startsWith('^') ? `${query.substring(1)}%` : `%${query}%`;
      if (searchMode === 'symbol') where.symbol = { [Op.like]: patternString };
      else if (searchMode === 'synonym') where.synonyms = { [Op.like]: patternString };
      else {
        const likeCondition = { [Op.like]: patternString };
        Object.assign(where, {
          [Op.or]: [
            { id: likeCondition },
            { type_of_gene: likeCondition },
            { symbol: likeCondition },
            { synonyms: likeCondition },
            { description: likeCondition },
            { other_designations: likeCondition },
            { map_location: likeCondition },
            { feature_type: likeCondition },
            { modification_date: likeCondition }
          ]
        });
      }
    }

    const { count, rows } = await GeneInfo.findAndCountAll({
      where,
      limit,
      offset,
      order: [['id', 'ASC']]
    });
    const geneInfoList = rows.map((r) => r.dataValues);
    const totalPages = Math.ceil(count / limit);
    const pagination = { totalPages, page, totalCount: count };

    res.render('gene/index', { title: 'Search Gene Info', geneInfoList, limit, ...(await currentTaxonomyAndCandidates(taxId)), pagination, query, searchMode, taxId });
  },

  async detail(req, res, next) {
    const id = req.params.id;
    const [symbol, description, geneInfo] = await getGeneInfo(id);
    const seed = {};
    const refseqStatusTable = await getRefseqInfo(id, seed);
    const [homologenes, species] = await getHomologenes(geneInfo.group_id);
    const taxId = req.cookies.taxId || 9606;
    const [blastScores, reverseBestsDict] = await getBlastScores(geneInfo.symbol);

    res.render('gene/detail', {
      title: description,
      ...(await currentTaxonomyAndCandidates(taxId)),
      id,
      taxId,
      symbol,
      description,
      geneInfo,
      refseqStatusTable,
      homologenes,
      blastScores,
      reverseBestsDict,
      species
    });
  }
};

module.exports = geneController;
