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

function createSummaryTable(geneId) {
  let fileContent = fs.readFileSync("gene_data/gene_info_tax9606.2022-09-30").toString();
  let geneInfo = Papa.parse(fileContent, {
    header: true
  });
  for(let row of geneInfo.data) {
    if(row.GeneID == geneId) {
      let summaryTable = {};
      for(let header of headers) {
        summaryTable[header] = row[header];
      }
      return summaryTable;
    }
  }
}

const geneController = {
  async detail(req, res, next) {
    const id = req.params.id;
    const summaryTable = createSummaryTable(id);
    res.render('gene/detail', {
      title: 'Gene info',
      id,
      summaryTable
    });
  }
};

module.exports = geneController;
