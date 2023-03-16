const fs = require('fs');
const Papa = require('papaparse')
const { Gene2RefSeqTax9606, GeneInfo, Species } = require('../models')
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


const geneController = {
  async detail(req, res, next) {
    const id = req.params.id;
    const [symbol, description, geneInfo] = await getGeneInfo(id);
    const seed = {};
    const refseqStatusTable = await getRefseqInfo(id, seed);
    const homologenes = await getHomologenes(geneInfo.group_id);

    res.render('gene/detail', {
      title: 'Gene info',
      id,
      symbol,
      description,
      geneInfo,
      refseqStatusTable,
      homologenes
    });
  }
};

module.exports = geneController;
