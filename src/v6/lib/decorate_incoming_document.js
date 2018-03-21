const decorate_incoming_document = ({doc, req}) => {
    console.log('Incoming Document',doc)
  doc.personalised_instance_id = req.personalised_instance_id
  doc.updated_at = (+new Date())
    console.log('Decorated Document',doc)
  return doc
}

module.exports = {decorate_incoming_document}
