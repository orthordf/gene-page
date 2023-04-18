const fs = require('fs');
const Papa = require('papaparse')
const { Gene2RefSeqTax9606, GeneInfo, Species, Gene2RefSeq } = require('../models')
const createError = require("http-errors");


async function getGeneInfo(geneId) {
  let geneInfo = await GeneInfo.findOne({ where: { id: geneId } });
  geneInfo = geneInfo.dataValues
  let symbol = '', description = '';
  symbol = geneInfo['symbol'];
  description = geneInfo['description'];
  return [symbol, description, geneInfo];
}

async function getRefseqInfo(geneId, seed) {
  let refseqStatusTable = {};
  let records = await Gene2RefSeqTax9606.findAll({ where: { gene_id: geneId } });
  for(let row of records) {
    row = row.dataValues;
    let RNAVersion = row['rna_nucleotide_accession_version'];
    let ProteinVersion = row['protein_accession_version'];
    let status = row['status'];
    if(RNAVersion !== '-' || ProteinVersion !== '-') {
      refseqStatusTable[status] ||= {};
      refseqStatusTable[status][RNAVersion] ||= new Set();
      refseqStatusTable[status][RNAVersion].add(ProteinVersion);
      seed[ProteinVersion] = 1; // TODO: What does '1' mean?
    }
  }
  return refseqStatusTable;
}


async function getHomologenes(groupId) {
  let records = await GeneInfo.findAll({ where: { group_id: groupId }, include: Species });
  return records.map(r => r.dataValues);
}


async function getBlastScores(symbol) {
  let filePath = `gene_data/blast.scores/${symbol}.scores.txt`;
  if(!fs.existsSync(filePath))
     return null;
  fileContent = fs.readFileSync(filePath).toString();
  let blastRecords = Papa.parse(fileContent);

  let targetMap = {};

  blastScores = blastRecords.data.map(record => {
    let scoreDict = {
      speciesIndex: record[0],
      query: record[1],
      target: record[2],
      score: record[4],
      description: record[5],
      isBBH: record[6] == 1,
      ratio: record[8],
      reverseBest: record[9],
    }
    targetMap[record[2]] = scoreDict;
    return scoreDict;
  });

  targetSymbols = await Gene2RefSeq.findAll({where: {protein_id: blastScores.map(r => r.target)}});

  targetSymbols.forEach((r) => {
    let scoreRecord = targetMap[r.dataValues.protein_id];
    scoreRecord.targetSymbol = r.dataValues.symbol;
    scoreRecord.targetGeneID = r.dataValues.gene_id;
  });

  return blastScores;
}


const geneController = {
  async detail(req, res, next) {
    const id = req.params.id;
    const [symbol, description, geneInfo] = await getGeneInfo(id);
    const seed = {};
    const refseqStatusTable = await getRefseqInfo(id, seed);
    const homologenes = await getHomologenes(geneInfo.group_id);
    const blastScores = await(getBlastScores(geneInfo.symbol));
    const blastSpecies = [
      'human', 'chimp', 'monkey', 'mouse', 'rat', 'dog', 'cow', 'chicken', 'Xenopus', 'zebrafish', 'Drosophila', 'mosquito', 'nematode',
      'yeast', '', '', '', '', '', 'plant', ''
    ];

    res.render('gene/detail', {
      title: 'Gene info',
      id,
      symbol,
      description,
      geneInfo,
      refseqStatusTable,
      homologenes,
      blastScores,
      blastSpecies,
    });
  }
};

module.exports = geneController;
