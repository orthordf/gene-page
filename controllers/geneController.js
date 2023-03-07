const fs = require('fs');
const Papa = require('papaparse')

const headers = [
  "GeneID",
  "Symbol",
  "Synonyms",
  "dbXrefs",
  "chromosome",
  "map_location",
  "description",
  "type_of_gene",
  "Symbol_from_nomenclature_authority",
  "Full_name_from_nomenclature_authority",
  "Nomenclature_status",
  "Other_designations",
  "Modification_date",
  "Feature_type"
];

function getGeneInfo(geneId) {
  let fileContent = fs.readFileSync("gene_data/gene_info_tax9606.2022-09-30").toString();
  let geneInfo = Papa.parse(fileContent, {
    header: true
  });
  let summaryTable = {}, symbol = '', description = '';
  for(let row of geneInfo.data) {
    if(row.GeneID == geneId) {
      symbol = row['Symbol'];
      description = row['description'];
      for(let header of headers) {
        summaryTable[header] = row[header];
      }
    }
  }
  return [symbol, description, summaryTable];
}


function getRefseqInfo(geneId, seed) {
  let fileContent = fs.readFileSync("gene_data/gene2refseq_tax9606").toString();
  let gene2RefSeqInfo = Papa.parse(fileContent, {
    header: true
  });
  let refseqStatusTable = {};
  for(let row of gene2RefSeqInfo.data) {
    if(row.GeneID == geneId) {
      let RNAVersion = row['RNA_nucleotide_accession.version'];
      let ProteinVersion = row['protein_accession.version'];
      let status = row['status'];
      if(RNAVersion !== '-' || ProteinVersion !== '-') {
        refseqStatusTable[status] ||= {};
        refseqStatusTable[status][RNAVersion] ||= new Set();
        refseqStatusTable[status][RNAVersion].add(ProteinVersion);
        seed[ProteinVersion] = 1; // TODO: What does '1' mean?
      }
    }
  }
  return refseqStatusTable;
}

const geneController = {
  async detail(req, res, next) {
    const id = req.params.id;
    const [symbol, description, summaryTable] = getGeneInfo(id);
    const seed = {};
    const refseqStatusTable = getRefseqInfo(id, seed);
    res.render('gene/detail', {
      title: 'Gene info',
      id,
      symbol,
      description,
      summaryTable,
      refseqStatusTable
    });
  }
};

module.exports = geneController;
