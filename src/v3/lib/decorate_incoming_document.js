const decorate_incoming_document = ({doc, req}) => {
  doc.user = req.user
  doc.personalised_instance_id = req.personalised_instance_id
  doc.updated_at = (+new Date())
  return doc
}

module.exports = {decorate_incoming_document}
