const mongoose = require('mongoose')
const TagService = require('../services/TagService')
const config = require('../configs/configTest')
const should = require('should')

//Connexion et réinitialisation de la BDD Mongo et création des models avant les tests
before((done) => {
  (async () => {
    const connection = await mongoose.connect(config.mongo_url)
    await connection.connection.db.dropDatabase()
    const modelPromises = Object.values(mongoose.models).map(model => model.syncIndexes())
    await Promise.all(modelPromises)
  })().then(() => {
    done()
  }).catch((err) => {
    console.log(err)
  })
})

let tagValidSchema = {
    name : "Valid tag number 1 été",
    tagCategory : "Culture"
}

let tagValidSchema2 = {
    name : "Valid tag 2",
    tagCategory : "Culture"
}

let tagValidSchema3 = {
    name : "Valid tag 3",
    tagCategory : "Culture"
}

let tagSchemaWithoutName = {
    name : null,
    tagCategory : "Culture"
}

let tagInvalidSchemaForbiddenCharacters = {
    name : "Number of people : >= 3",
    tagCategory : "Culture"
}

let tagInvalidSchemaIncorrectFormat = {
    name : {name : "Valid tag"},
    tagCategory : "Culture"
}

let tagInvalidSchemaExtraField = {
  name : "Tag Extrafield",
  extrafield : "You shall not pass",
  tagCategory : "Culture",
}

describe('TagService - addOneTag', function () {
  it('Add a tag with success.', async function () {
    let result = await TagService.addOneTag(tagValidSchema)
    should(result).have.property('name', tagValidSchema.name)
    should(result).have.property('tagCategory', tagValidSchema.tagCategory)
    should(result).have.property('_id')
    should(result).have.property('createdAt')
    should(result).have.property('updatedAt')
    tagValidSchema['_id'] = result._id
  })
  it('Add a tag without name.', async function () {
    let result = await TagService.addOneTag(tagSchemaWithoutName).should.be.rejectedWith(Object)
    should(result).have.property('type', 'NOT_VALID')
    should(result).have.property('fields')
    should(result.fields).have.property('name', 'Path `name` is required.')
  })
  it('Add a tag with an already taken name.', async function () {
      let tmp_tag_no_valid = { ...tagValidSchema }
      delete tmp_tag_no_valid['_id']
  
      try {
        await TagService.addOneTag(tmp_tag_no_valid)
        throw new Error("Expected rejection on already taken name test")
      } catch (error) {
        should(error).have.property('type', 'DUPLICATE')
        should(error).have.property('fields')
        should(error.fields).have.property('name')
      }
    })
    it('Add a tag with forbidden characters in name.', async function () {
      try {
        await TagService.addOneTag(tagInvalidSchemaForbiddenCharacters)
        throw new Error("Expected rejection on forbidden characters in name test")
      } catch (error) {
        should(error).have.property('type', 'NOT_VALID')
        should(error).have.property('fields')
        should(error.fields).have.property('name', 'Invalid characters detected. Use only letters, numbers and spaces.')
      }
    })
    it('Add a tag with an incorrect format name.', async function () {
      try {
        await TagService.addOneTag(tagInvalidSchemaIncorrectFormat)
        throw new Error("Expected rejection on incorrect format name test")
      } catch (error) {
        should(error).have.property('type', 'NOT_VALID_CAST')
        should(error).have.property('fields')
        should(error.fields).have.property('name')
      }
    })
    it('Add a tag with an extra field.', async function () {
      try {
        let result = await TagService.addOneTag(tagInvalidSchemaExtraField)
        throw new Error("Expected rejection on extrafield test")
      } catch (error) {
        should(error).have.property('type', 'NOT_VALID')
        should(error).have.property('fields')
        should(error.fields).have.property('extrafield', "Field 'extrafield' is not defined in the schema.")
      }
    })
})

describe('TagService - findOneTagById', function () {
  it('Find a tag with success.', async function () {
    let result = await TagService.findOneTagById(tagValidSchema['_id'])
    should(result).have.property('name', tagValidSchema.name)
    should(result).have.property('tagCategory', tagValidSchema.tagCategory)
    should(result).have.property('_id')
    should(result).have.property('createdAt')
    should(result).have.property('updatedAt')
  })
  it('Search a tag with an incorrect format', async function () {
    let result = await TagService.findOneTagById("Tag valid").should.be.rejectedWith(Object)
    should(result).have.property('type', 'NOT_VALID_CAST')
    should(result).have.property('message', "One or more fields do not have the correct format.")
    should(result).have.property('fields')
    should(result.fields).have.property('_id')
  })
  it("Search a tag with an non-existent ID without triggering an error", async function () {
    let result = await TagService.findOneTagById(new mongoose.Types.ObjectId())
    should(result).not.be.ok()
  })
  it("Search a tag with an non-existent ID and trigger an error", async function () {
    let result = await TagService.findOneTagById(new mongoose.Types.ObjectId(), { error_not_found: true }).should.be.rejectedWith(Object)
    should(result).have.property('type', 'NOT_FOUND')
    should(result).have.property('message', "Tag not found.")
  })
  it("Search a tag with a null ID and trigger an error", async function () {
    let result = await TagService.findOneTagById(null, { error_not_found: true }).should.be.rejectedWith(Object)
    should(result).have.property('type', 'NOT_FOUND')
    should(result).have.property('message', "Tag not found.")
  })
  it("Search a tag with a null ID without triggering an error", async function () {
    let result = await TagService.findOneTagById(null, { error_not_found: false })
    should(result).not.be.ok()
  })
})

describe('TagService - findOneTagByName', function () {
  it('Find a tag with success.', async function () {
    let result = await TagService.findOneTagByName("Valid tag number 1 été")
    should(result).have.property('name', tagValidSchema.name)
    should(result).have.property('tagCategory', tagValidSchema.tagCategory)
    should(result).have.property('_id')
    should(result).have.property('createdAt')
    should(result).have.property('updatedAt')
  })
  it('Search a tag with an incorrect format', async function () {
    let result = await TagService.findOneTagByName({ name : "Valid tag number 1 été"}).should.be.rejectedWith(Object)
    should(result).have.property('type', 'NOT_VALID_CAST')
    should(result).have.property('message', "One or more fields do not have the correct format.")
    should(result).have.property('fields')
  })
  it("Search a tag with an non-existent name without triggering an error", async function () {
    let result = await TagService.findOneTagByName("Non existent tag")
    should(result).not.be.ok()
  })
  it("Search a tag with an non-existent name and trigger an error", async function () {
    let result = await TagService.findOneTagByName("Non existent tag", { error_not_found: true }).should.be.rejectedWith(Object)
    should(result).have.property('type', 'NOT_FOUND')
    should(result).have.property('message', "Tag not found.")
  })
  it("Search a tag with a null name and trigger an error", async function () {
    let result = await TagService.findOneTagByName(null, { error_not_found: true }).should.be.rejectedWith(Object)
    should(result).have.property('type', 'NOT_FOUND')
    should(result).have.property('message', "Tag not found.")
  })
  it("Search a tag with a null name without triggering an error", async function () {
    let result = await TagService.findOneTagByName(null, { error_not_found: false })
    should(result).not.be.ok()
  })
})

describe('TagService - updateOneTagById', function () {
  it('Update a tag with success.', async function () {
    let name = "Valid tag"
    let result = await TagService.updateOneTagById(tagValidSchema['_id'], {name : name})
    should(result).have.property('name', name)
    should(result).have.property('tagCategory', tagValidSchema.tagCategory)
    should(result).have.property('_id')
    should(result).have.property('createdAt')
    should(result).have.property('updatedAt')
  })
  it('Update a tag with an incorrect format', async function () {
    let name = {name : "Valid tag"}
    let result = await TagService.updateOneTagById(tagValidSchema['_id'], {name : name}).should.be.rejectedWith(Object)
    should(result).have.property('type', 'NOT_VALID_CAST')
    should(result).have.property('message', "One or more fields do not have the correct format.")
    should(result).have.property('fields')
    should(result.fields).have.property('name')
  })
  it("Update a tag's required field with a void value.", async function () {
    let name = null
    try {
      await TagService.updateOneTagById(tagValidSchema['_id'], {name : name})
      throw new Error ("Expected rejection on void value for a required field")
    } catch(error){
      should(error).have.property('type', 'NOT_VALID')
      should(error).have.property('fields')
      should(error.fields).have.property('name', 'Path `name` is required.')
    }  
  })
  it("Update a tag's with an already taken name.", async function () {
    let name = "Valid tag"
    let newTag = await TagService.addOneTag(tagValidSchema2)
    try {
      await TagService.updateOneTagById(newTag._id, {name : name})
      throw new Error("Expected rejection on already taken name test")   
    } catch (error) {
      should(error).have.property('type', 'DUPLICATE')
      should(error).have.property('fields')
      should(error.fields).have.property('name')
    }
  })
  it("Update a tag's name with forbidden characters.", async function () {
    let name = '<script>VALID TAG !!!</script>'
    try {
      await TagService.updateOneTagById(tagValidSchema['_id'], {name : name})
      throw new Error("Expected rejection on forbidden name characters test")
    } catch (error) {
      should(error).have.property('type', 'NOT_VALID')
      should(error).have.property('fields')
      should(error.fields).have.property('name', 'Invalid characters detected. Use only letters, numbers and spaces.')
    }
  })
  it('Update a nonexistent field', async () => {
    try {
      await TagService.updateOneTagById(tagValidSchema['_id'], {nonexistentfield : "You shall not pass"})
      throw new Error('Expected rejection on nonexistent fields test')
    } catch (error) {
      should(error).have.property('type', 'NOT_VALID')
      should(error).have.property('fields')
      should(error.fields).have.property('nonexistentfield', "Field 'nonexistentfield' is not defined in the schema.")
    }
  })
  it("Update a tag with an non-existent ID without triggering an error", async function () {
    let result = await TagService.updateOneTagById(new mongoose.Types.ObjectId())
    should(result).not.be.ok()
  })
  it("Update a tag with an non-existent ID and trigger an error", async function () {
    let result = await TagService.updateOneTagById(new mongoose.Types.ObjectId(), {name : "Valid tag"}, { error_not_found: true }).should.be.rejectedWith(Object)
    should(result).have.property('type', 'NOT_FOUND')
    should(result).have.property('message', "Tag not found.")
  })
  it("Update a tag with a null ID and trigger an error", async function () {
    let result = await TagService.updateOneTagById(null, {name : "Valid tag"}, { error_not_found: true }).should.be.rejectedWith(Object)
    should(result).have.property('type', 'NOT_FOUND')
    should(result).have.property('message', "Tag not found.")
  })
  it("Update a tag with a null ID without triggering an error", async function () {
    let result = await TagService.updateOneTagById(null, {name : "Valid tag"}, { error_not_found: false })
    should(result).not.be.ok()
  })
})

describe('TagService - updateOneTagByName', function () {
  it('Update a tag with success.', async function () {
    let name = "Random tag"
    let result = await TagService.updateOneTagByName("Valid tag", {name : name})
    should(result).have.property('name', name)
    should(result).have.property('tagCategory', tagValidSchema.tagCategory)
    should(result).have.property('_id')
    should(result).have.property('createdAt')
    should(result).have.property('updatedAt')
  })
  it('Update a tag with an incorrect format', async function () {
    let name = {name : "Valid tag"}
    let result = await TagService.updateOneTagByName("Valid Tag", {name : name}).should.be.rejectedWith(Object)
    should(result).have.property('type', 'NOT_VALID_CAST')
    should(result).have.property('message', "One or more fields do not have the correct format.")
    should(result).have.property('fields')
    should(result.fields).have.property('name')
  })
  it("Update a tag's required field with a void value.", async function () {
    let name = null
    try {
      await TagService.updateOneTagByName("Valid tag", {name : name})
      throw new Error ("Expected rejection on void value for a required field")
    } catch(error){
      should(error).have.property('type', 'NOT_VALID')
      should(error).have.property('fields')
      should(error.fields).have.property('name', 'Path `name` is required.')
    }  
  })
  it("Update a tag's with an already taken name.", async function () {
    let name = "Random tag"
    let newTag = await TagService.addOneTag(tagValidSchema3)
    try {
      let result = await TagService.updateOneTagByName(newTag.name, {name : name})
      throw new Error("Expected rejection on already taken name test")   
    } catch (error) {
      should(error).have.property('type', 'DUPLICATE')
      should(error).have.property('fields')
      should(error.fields).have.property('name')
    }
  })
  it("Update a tag's name with forbidden characters.", async function () {
    let name = '<script>VALID TAG !!!</script>'
    try {
      await TagService.updateOneTagByName("Valid tag", {name : name})
      throw new Error("Expected rejection on forbidden name characters test")
    } catch (error) {
      should(error).have.property('type', 'NOT_VALID')
      should(error).have.property('fields')
      should(error.fields).have.property('name', 'Invalid characters detected. Use only letters, numbers and spaces.')
    }
  })
  it('Update a nonexistent field', async () => {
    try {
      await TagService.updateOneTagByName("Valid tag", {nonexistentfield : "You shall not pass"})
      throw new Error('Expected rejection on nonexistent fields test')
    } catch (error) {
      should(error).have.property('type', 'NOT_VALID')
      should(error).have.property('fields')
      should(error.fields).have.property('nonexistentfield', "Field 'nonexistentfield' is not defined in the schema.")
    }
  })
  it("Update a tag with an non-existent name without triggering an error", async function () {
    let result = await TagService.updateOneTagByName("Valid Tag 4")
    should(result).not.be.ok()
  })
  it("Update a tag with an non-existent name and trigger an error", async function () {
    let result = await TagService.updateOneTagByName("Valid tag 4", {name : "Valid tag"}, { error_not_found: true }).should.be.rejectedWith(Object)
    should(result).have.property('type', 'NOT_FOUND')
    should(result).have.property('message', "Tag not found.")
  })
  it("Update a tag with a null name and trigger an error", async function () {
    let result = await TagService.updateOneTagByName(null, {name : "Valid tag"}, { error_not_found: true }).should.be.rejectedWith(Object)
    should(result).have.property('type', 'NOT_FOUND')
    should(result).have.property('message', "Tag not found.")
  })
  it("Update a tag with a null name without triggering an error", async function () {
    let result = await TagService.updateOneTagByName(null, {name : "Valid tag"}, { error_not_found: false })
    should(result).not.be.ok()
  })
})

describe('TagService - deleteOneTagById', function () {
  it('Delete a tag with success.', async function () {
    let result = await TagService.deleteOneTagById(tagValidSchema['_id'])
    should(result).have.property('name')
    should(result).have.property('tagCategory', tagValidSchema.tagCategory)
    should(result).have.property('_id')
    should(result).have.property('createdAt')
    should(result).have.property('updatedAt')
  })
  it('Delete a tag with an incorrect format', async function () {
    let result = await TagService.deleteOneTagById("Valid tag").should.be.rejectedWith(Object)
    should(result).have.property('type', 'NOT_VALID_CAST')
    should(result).have.property('message', "One or more fields do not have the correct format.")
    should(result).have.property('fields')
    should(result.fields).have.property('_id')
  })
  it("Delete a tag with an non-existent ID without triggering an error", async function () {
    let result = await TagService.deleteOneTagById(new mongoose.Types.ObjectId())
    should(result).not.be.ok()
  })
  it("Delete a tag with an non-existent ID and trigger an error", async function () {
    let result = await TagService.deleteOneTagById(new mongoose.Types.ObjectId(), { error_not_found: true }).should.be.rejectedWith(Object)
    should(result).have.property('type', 'NOT_FOUND')
    should(result).have.property('message', "Tag not found.")
  })
  it("Delete a tag with a null ID and trigger an error", async function () {
    let result = await TagService.deleteOneTagById(null, { error_not_found: true }).should.be.rejectedWith(Object)
    should(result).have.property('type', 'NOT_FOUND')
    should(result).have.property('message', "Tag not found.")
  })
  it("Delete a tag with a null ID without triggering an error", async function () {
    let result = await TagService.deleteOneTagById(null, { error_not_found: false })
    should(result).not.be.ok()
  })
})

describe('TagService - deleteOneTagById', function () {
  it('Delete a tag with success.', async function () {
    await TagService.addOneTag(tagValidSchema)
    let result = await TagService.deleteOneTagByName(tagValidSchema['name'])
    should(result).have.property('name')
    should(result).have.property('tagCategory', tagValidSchema.tagCategory)
    should(result).have.property('_id')
    should(result).have.property('createdAt')
    should(result).have.property('updatedAt')
  })
  it('Delete a tag with an incorrect format', async function () {
    let result = await TagService.deleteOneTagByName({ name : "Valid tag"}).should.be.rejectedWith(Object)
    should(result).have.property('type', 'NOT_VALID_CAST')
    should(result).have.property('message', "One or more fields do not have the correct format.")
    should(result).have.property('fields')
    should(result.fields).have.property('name')
  })
  it("Delete a tag with an non-existent name without triggering an error", async function () {
    let result = await TagService.deleteOneTagByName("Valid tag")
    should(result).not.be.ok()
  })
  it("Delete a tag with an non-existent ID and trigger an error", async function () {
    let result = await TagService.deleteOneTagByName("Valid tag", { error_not_found: true }).should.be.rejectedWith(Object)
    should(result).have.property('type', 'NOT_FOUND')
    should(result).have.property('message', "Tag not found.")
  })
  it("Delete a tag with a null ID and trigger an error", async function () {
    let result = await TagService.deleteOneTagByName(null, { error_not_found: true }).should.be.rejectedWith(Object)
    should(result).have.property('type', 'NOT_FOUND')
    should(result).have.property('message', "Tag not found.")
  })
  it("Delete a tag with a null ID without triggering an error", async function () {
    let result = await TagService.deleteOneTagByName(null, { error_not_found: false })
    should(result).not.be.ok()
  })
})
