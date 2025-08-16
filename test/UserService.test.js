const mongoose = require('mongoose')
const UserService = require('../services/UserService')
const config = require('../configs/configTest')
const should = require('should')


let userValidSchema = {
    username : 'Jean Test',
    email : 'jeantest@testing.com',
    password : 'LeMotDePasseDeJeanTest',
    location : 'Paris',
    tags : [
        new mongoose.Types.ObjectId(),
        new mongoose.Types.ObjectId(),
        new mongoose.Types.ObjectId()
    ]
}

let userValidSchema2 = {
    username : 'Jean Test 2',
    email : 'jeantest2@testing.com',
    password : 'LeMotDePasseDeJeanTest',
    location : 'Paris',
    tags : [
        new mongoose.Types.ObjectId(),
        new mongoose.Types.ObjectId(),
        new mongoose.Types.ObjectId()
    ]
}

let userValidSchema3 = {
    username : 'Jean Test 3',
    email : 'jeantest3@testing.com',
    password : 'LeMotDePasseDeJeanTest',
    location : 'Paris',
    tags : [
        new mongoose.Types.ObjectId(),
        new mongoose.Types.ObjectId(),
        new mongoose.Types.ObjectId()
    ]
}

let friendValidSchema = {
    username : 'Jean Copain',
    email : 'jeancopain@testing.com',
    password : 'LeMotDePasseDeJeanTest',
    location : 'Paris',
    tags : [
        new mongoose.Types.ObjectId(),
        new mongoose.Types.ObjectId(),
        new mongoose.Types.ObjectId()
    ]
}


let userSchemaWithoutUsername = {
    username : null,
    email : 'null@testing.com',
    password : 'LeMotDePasseDeJeanTest',
    location : 'Paris',
    tags : [
        new mongoose.Types.ObjectId(),
        new mongoose.Types.ObjectId(),
        new mongoose.Types.ObjectId()
    ]
}

let userSchemaWithoutEmail = {
    username : 'Jean Mailless',
    email : '',
    password : 'LeMotDePasseDeJeanTest',
    location : 'Paris',
    tags : [
        new mongoose.Types.ObjectId(),
        new mongoose.Types.ObjectId(),
        new mongoose.Types.ObjectId()
    ]
}

let userInvalidSchemaIncorrectFormat = {
    username : ['Jean Format'],
    email : 'jeanformat@testing.com',
    password : 'LeMotDePasseDeJeanTest',
    location : 'Paris',
    tags : [
        new mongoose.Types.ObjectId(),
        new mongoose.Types.ObjectId(),
        new mongoose.Types.ObjectId()
    ]
}

let userInvalidSchemaNotObjectIdInTags = {
    username : 'Jean Tag-Format',
    email : 'jeantagformat@testing.com',
    password : 'LeMotDePasseDeJeanTest',
    location : 'Paris',
    tags : [
        new mongoose.Types.ObjectId(),
        new mongoose.Types.ObjectId(),
        new mongoose.Types.ObjectId(),
        "new mongoose.Types.ObjectId()"
    ]
}

let userInvalidSchemaNotEnoughTags = {
    username : 'Jean Tag',
    email : 'jeantag@testing.com',
    password : 'LeMotDePasseDeJeanTest',
    location : 'Paris',
    tags : [
        new mongoose.Types.ObjectId(),
        new mongoose.Types.ObjectId()
    ]
}

let userInvalidSchemaTooShortPassword = {
    username : 'Jean Password',
    email : 'jeanpassword@testing.com',
    password : 'tooshort',
    location : 'Paris',
    tags : [
        new mongoose.Types.ObjectId(),
        new mongoose.Types.ObjectId(),
        new mongoose.Types.ObjectId()
    ]
}

let userInvalidSchemaInvalidRole = {
    username : 'Jean Role',
    email : 'jeanrole@testing.com',
    password : 'LeMotDePasseDeJeanTest',
    location : 'Paris',
    role : "premium user",
    tags : [
        new mongoose.Types.ObjectId(),
        new mongoose.Types.ObjectId(),
        new mongoose.Types.ObjectId()
    ]
}

let userInvalidSchemaForbiddenCharactersUsername = {
    username : '<script>Jean Forbidden !!!</script>',
    email : 'jeanforbidden@testing.com',
    password : 'LeMotDePasseDeJeanTest',
    location : 'Paris',
    tags : [
        new mongoose.Types.ObjectId(),
        new mongoose.Types.ObjectId(),
        new mongoose.Types.ObjectId()
    ]
}

let userInvalidSchemaForbiddenCharactersLocation = {
    username : 'Jean Location',
    email : 'jeanlocation@testing.com',
    password : 'LeMotDePasseDeJeanTest',
    location : 'Paris_',
    tags : [
        new mongoose.Types.ObjectId(),
        new mongoose.Types.ObjectId(),
        new mongoose.Types.ObjectId()
    ]
}

let userInvalidSchemaInvalidEmail = {
    username : 'Jean Mail',
    email : 'jeanmail@@testing.com',
    password : 'LeMotDePasseDeJeanTest',
    location : 'Paris',
    tags : [
        new mongoose.Types.ObjectId(),
        new mongoose.Types.ObjectId(),
        new mongoose.Types.ObjectId()
    ]
}

let userInvalidSchemaExtraField = {
    username : 'Jean Field',
    email : 'jeanfield@testing.com',
    password : 'LeMotDePasseDeJeanTest',
    location : 'Paris',
    extrafield : 'You shall not pass',
    tags : [
        new mongoose.Types.ObjectId(),
        new mongoose.Types.ObjectId(),
        new mongoose.Types.ObjectId()
    ]
}

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

//Tests
describe('UserService - addOneUser', function () {
  it('Add an user with success.', async function () {
    let result = await UserService.addOneUser(userValidSchema)
    should(result).have.property('username', userValidSchema.username)
    should(result).have.property('email', userValidSchema.email)
    should(result).have.property('password', userValidSchema.password)
    should(result).have.property('location', userValidSchema.location)
    should(result).have.property('tags', userValidSchema.tags)
    should(result).have.property('_id')
    should(result).have.property('createdAt')
    should(result).have.property('updatedAt')
    userValidSchema['_id'] = result._id
  })
  it('Add an user without username.', async function () {
    let result = await UserService.addOneUser(userSchemaWithoutUsername).should.be.rejectedWith(Object)
    should(result).have.property('type', 'NOT_VALID')
    should(result).have.property('fields')
    should(result.fields).have.property('username', 'Path `username` is required.')
  })
  it('Add an user without email.', async function () {
    let result = await UserService.addOneUser(userSchemaWithoutEmail).should.be.rejectedWith(Object)
    should(result).have.property('type', 'NOT_VALID')
    should(result).have.property('fields')
    should(result.fields).have.property('email', 'Path `email` is required.')
  })
  it('Add an user without enough tags.', async function () {
    try {
      await UserService.addOneUser(userInvalidSchemaNotEnoughTags)
      throw new Error("Expected rejection on not enough tags test")
    } catch (error) {
      should(error).have.property('type', 'NOT_VALID')
      should(error).have.property('fields')
      should(error.fields).have.property('tags', 'You must provide at least 3 tags.')
    }
  })
  it('Add an user without multiple required fields.', async function () {
    let tmp_user_no_valid = { ...userValidSchema }
    delete tmp_user_no_valid['_id']
    delete tmp_user_no_valid['username']
    delete tmp_user_no_valid['email']
    delete tmp_user_no_valid['tags']

    try {
      await UserService.addOneUser(tmp_user_no_valid)
      throw new Error("Expected rejection on multiple required fields missing")
    } catch (error) {
      should(error).have.property('type', 'NOT_VALID')
      should(error).have.property('fields')
      should(error.fields).have.property('username', 'Path `username` is required.')
      should(error.fields).have.property('email', 'Path `email` is required.')
      should(error.fields).have.property('tags', 'You must provide at least 3 tags.')
    }
  })
  it('Add an user with an already taken username.', async function () {
    let tmp_user_no_valid = { ...userValidSchema }
    delete tmp_user_no_valid['_id']

    try {
      await UserService.addOneUser(tmp_user_no_valid)
      throw new Error("Expected rejection on already taken username test")
    } catch (error) {
      should(error).have.property('type', 'DUPLICATE')
      should(error).have.property('fields')
      should(error.fields).have.property('username')
    }
  })
  it('Add an user with an already taken email.', async function () {
    let tmp_user_no_valid = { ...userValidSchema, username : 'Jean-Mail' }
    delete tmp_user_no_valid['_id']
    try {
      await UserService.addOneUser(tmp_user_no_valid)
      throw new Error("Expected rejection on already taken email test")
    } catch (error) {
      should(error).have.property('type', 'DUPLICATE')
      should(error).have.property('fields')
      should(error.fields).have.property('email')
    }
  })
  it('Add an user with a field with an incorrect format (username here).', async function () {
    try {
      await UserService.addOneUser(userInvalidSchemaIncorrectFormat)
      throw new Error("Expected rejection on incorrect format value test")
    } catch (error) {
      should(error).have.property('type', 'NOT_VALID_CAST')
      should(error).have.property('fields')
      should(error.fields).have.property('username')
    }
  })
  it('Add an user with invalid ObjectId in tags.', async function () {
    try {
      await UserService.addOneUser(userInvalidSchemaNotObjectIdInTags)
      throw new Error("Expected rejection on invalid ObjectId in tags test")
    } catch (error) {
      should(error).have.property('type', 'NOT_VALID_CAST')
      should(error).have.property('fields')
      should(error.fields).have.property('tags')
    }
  })
  it('Add an user with a too short password', async function () {
    try {
      await UserService.addOneUser(userInvalidSchemaTooShortPassword)
      throw new Error("Expected Rejection on too short password test")
    } catch (error) {
      should(error).have.property('type', 'NOT_VALID')
      should(error).have.property('fields')
      should(error.fields).have.property('password', 'Password is too short (12 characters minimum are required).')
    }
  })
  it('Add an user with an invalid role.', async function () {
    try {
      await UserService.addOneUser(userInvalidSchemaInvalidRole)
      throw new Error("Expected Rejection on invalid role test")
    } catch (error) {
      should(error).have.property('type', 'NOT_VALID')
      should(error).have.property('fields')
      should(error.fields).have.property('role', "Invalid value for 'role'. Allowed values are: user, admin.")
    }
  })
  it('Add an user with forbidden characters in username.', async function () {
    try {
      await UserService.addOneUser(userInvalidSchemaForbiddenCharactersUsername)
      throw new Error("Expected rejection on forbidden username characters test")
    } catch (error) {
      should(error).have.property('type', 'NOT_VALID')
      should(error).have.property('fields')
      should(error.fields).have.property('username', 'Invalid characters detected. Use only letters, numbers, spaces, underscores, and dashes.')
    }
  })
  it('Add an user with forbidden characters in location.', async function () {
    try {
      await UserService.addOneUser(userInvalidSchemaForbiddenCharactersLocation)
      throw new Error("Expected rejection on forbidden location characters test")
    } catch (error) {
      should(error).have.property('type', 'NOT_VALID')
      should(error).have.property('fields')
      should(error.fields).have.property('location', 'Invalid characters detected. Use only letters, spaces, apostrophes, and dashes.')
    }
  })
  it('Add an user with invalid email format.', async function () {
    try {
      await UserService.addOneUser(userInvalidSchemaInvalidEmail)
      throw new Error("Expected rejection on invalid email format test")
    } catch (error) {
      should(error).have.property('type', 'NOT_VALID')
      should(error).have.property('fields')
      should(error.fields).have.property('email', 'Invalid email format.')
    }
  })
  it('Add an user with an extra field', async () => {
    try {
      await UserService.addOneUser(userInvalidSchemaExtraField)
      throw new Error('Expected rejection on extra fields test')
    } catch (error) {
      should(error).have.property('type', 'NOT_VALID')
      should(error).have.property('fields')
      should(error.fields).have.property('extrafield', "Field 'extrafield' is not defined in the schema.")
    }
  })
})

describe('UserService - findOneUserById', function () {
  it('Find an user with success.', async function () {
    let result = await UserService.findOneUserById(userValidSchema['_id'])
    should(result).have.property('username', userValidSchema.username)
    should(result).have.property('email', userValidSchema.email)
    should(result).have.property('password', userValidSchema.password)
    should(result).have.property('location', userValidSchema.location)
    should(result).have.property('tags', userValidSchema.tags)
    should(result).have.property('_id')
    should(result).have.property('createdAt')
    should(result).have.property('updatedAt')
  })
  it('Search an user with an incorrect format', async function () {
    let result = await UserService.findOneUserById("Jean Test").should.be.rejectedWith(Object)
    should(result).have.property('type', 'NOT_VALID_CAST')
    should(result).have.property('message', "One or more fields do not have the correct format.")
    should(result).have.property('fields')
    should(result.fields).have.property('_id')
  })
  it("Search an user with an non-existent ID without triggering an error", async function () {
    let result = await UserService.findOneUserById(new mongoose.Types.ObjectId())
    should(result).not.be.ok()
  })
  it("Search an user with an non-existent ID and trigger an error", async function () {
    let result = await UserService.findOneUserById(new mongoose.Types.ObjectId(), { error_not_found: true }).should.be.rejectedWith(Object)
    should(result).have.property('type', 'NOT_FOUND')
    should(result).have.property('message', "User not found.")
  })
  it("Search an user with a null ID and trigger an error", async function () {
    let result = await UserService.findOneUserById(null, { error_not_found: true }).should.be.rejectedWith(Object)
    should(result).have.property('type', 'NOT_FOUND')
    should(result).have.property('message', "User not found.")
  })
  it("Search an user with a null ID without triggering an error", async function () {
    let result = await UserService.findOneUserById(null, { error_not_found: false })
    should(result).not.be.ok()
  })
})

describe('UserService - findOneUserByUsername', function () {
  it('Find an user with success.', async function () {
    let result = await UserService.findOneUserByUsername("Jean Test")
    should(result).have.property('username', userValidSchema.username)
    should(result).have.property('email', userValidSchema.email)
    should(result).have.property('password', userValidSchema.password)
    should(result).have.property('location', userValidSchema.location)
    should(result).have.property('tags', userValidSchema.tags)
    should(result).have.property('_id')
    should(result).have.property('createdAt')
    should(result).have.property('updatedAt')
  })
  it('Search an user with an incorrect format', async function () {
    try {
      await UserService.findOneUserByUsername({username : "Jean Test"})
      throw new Error('Expected rejection on incorrect format test')
    } catch (error) {
      should(error).have.property('type', 'NOT_VALID_CAST')
      should(error).have.property('message', "One or more fields do not have the correct format.")
      should(error).have.property('fields')
      should(error.fields).have.property('username')
    }
  })
  it("Search an user user with an non-existent username without triggering an error", async function () {
    let result = await UserService.findOneUserByUsername("Jean Unfinded")
    should(result).not.be.ok()
  })
  it("Search an user user with an non-existent username and trigger an error", async function () {
    let result = await UserService.findOneUserByUsername("Jean Unfinded", { error_not_found: true }).should.be.rejectedWith(Object)
    should(result).have.property('type', 'NOT_FOUND')
    should(result).have.property('message', "User not found.")
  })
  it("Search an user user with a null username and trigger an error", async function () {
    let result = await UserService.findOneUserByUsername(null, { error_not_found: true }).should.be.rejectedWith(Object)
    should(result).have.property('type', 'NOT_FOUND')
    should(result).have.property('message', "User not found.")
  })
  it("Search an user user with a null username without triggering an error", async function () {
    let result = await UserService.findOneUserByUsername(null, { error_not_found: false })
    should(result).not.be.ok()
  })
})

describe('UserService - updateOneUserById', function () {
  it('Update an user with success.', async function () {
    let email = "jeanupdate@gmail.com"
    let result = await UserService.updateOneUserById(userValidSchema['_id'], {email : email})
    should(result).have.property('username', userValidSchema.username)
    should(result).have.property('email', email)
    should(result).have.property('password', userValidSchema.password)
    should(result).have.property('location', userValidSchema.location)
    should(result).have.property('tags', userValidSchema.tags)
    should(result).have.property('_id')
    should(result).have.property('createdAt')
    should(result).have.property('updatedAt')
  })
  it('Update an user with an incorrect format', async function () {
    let email = {email : "jeanupdate@gmail.com"}
    let result = await UserService.updateOneUserById(userValidSchema['_id'], {email : email}).should.be.rejectedWith(Object)
    should(result).have.property('type', 'NOT_VALID_CAST')
    should(result).have.property('message', "One or more fields do not have the correct format.")
    should(result).have.property('fields')
    should(result.fields).have.property('email')
  })
  it("Update an user's required field with a void value.", async function () {
    let username = null
    try {
      await UserService.updateOneUserById(userValidSchema['_id'], {username : username})
      throw new Error ("Expected rejection on void value for a required field")
    } catch(error){
      should(error).have.property('type', 'NOT_VALID')
      should(error).have.property('fields')
      should(error.fields).have.property('username', 'Path `username` is required.')
    }  
  })
  it("Update an user's email with invalid email format.", async function () {
    let email = "jeanupdate@@gmail.com"
    try {
      await UserService.updateOneUserById(userValidSchema['_id'], {email : email})
      throw new Error("Expected rejection on invalid email format test")
    } catch (error) {
      should(error).have.property('type', 'NOT_VALID')
      should(error).have.property('fields')
      should(error.fields).have.property('email', 'Invalid email format.')
    }
  })
  it("Update an user's tags without enough tags.", async function () {
    let tags = [
        new mongoose.Types.ObjectId(),
        new mongoose.Types.ObjectId()
      ]
    try {
      await UserService.updateOneUserById(userValidSchema['_id'], {tags : tags})
      throw new Error("Expected rejection on not enough tags test")
    } catch (error) {
      should(error).have.property('type', 'NOT_VALID')
      should(error).have.property('fields')
      should(error.fields).have.property('tags', 'You must provide at least 3 tags.')
    }
  })
  it("Update an user's with an already taken username.", async function () {
    let username = "Jean Test"
    let newUser = await UserService.addOneUser(userValidSchema2)
    try {
      await UserService.updateOneUserById(newUser._id, {username : username})
      throw new Error("Expected rejection on already taken username test")   
    } catch (error) {
      should(error).have.property('type', 'DUPLICATE')
      should(error).have.property('fields')
      should(error.fields).have.property('username')
    }
  })
  it("Update an user's password with a too short one.", async function () {
    let password = "tooshort"
    try {
      await UserService.updateOneUserById(userValidSchema['_id'], {password : password})
      throw new Error("Expected rejection on too short password test")
    } catch (error) {
      should(error).have.property('type', 'NOT_VALID')
      should(error).have.property('fields')
      should(error.fields).have.property('password', 'Password is too short (12 characters minimum are required).')
    }
  })
  it("Update an user's username with forbidden characters.", async function () {
    let username = '<script>Jean Forbidden !!!</script>'
    try {
      await UserService.updateOneUserById(userValidSchema['_id'], {username : username})
      throw new Error("Expected rejection on forbidden username characters test")
    } catch (error) {
      should(error).have.property('type', 'NOT_VALID')
      should(error).have.property('fields')
      should(error.fields).have.property('username', 'Invalid characters detected. Use only letters, numbers, spaces, underscores, and dashes.')
    }
  })
  it("Update an user's location with forbidden characters.", async function () {
    let location = 'Paris_'
    try {
      await UserService.updateOneUserById(userValidSchema['_id'], {location : location})
      throw new Error("Expected rejection on forbidden location characters test")
    } catch (error) {
      should(error).have.property('type', 'NOT_VALID')
      should(error).have.property('fields')
      should(error.fields).have.property('location', 'Invalid characters detected. Use only letters, spaces, apostrophes, and dashes.')
    }
  })
  it("Update an user's role with an invalid one.", async function () {
    let role = "superadmin"
    try {
      await UserService.updateOneUserById(userValidSchema['_id'], {role : role})
      throw new Error("Expected rejection on invalid role test")
    } catch (error) {
      should(error).have.property('type', 'NOT_VALID')
      should(error).have.property('fields')
      should(error.fields).have.property('role', "Invalid value for 'role'. Allowed values are: user, admin.")
    }
  })
  it('Update a nonexistent field', async () => {
    try {
      await UserService.updateOneUserById(userValidSchema['_id'], {nonexistentfield : "You shall not pass"})
      throw new Error('Expected rejection on nonexistent fields test')
    } catch (error) {
      should(error).have.property('type', 'NOT_VALID')
      should(error).have.property('fields')
      should(error.fields).have.property('nonexistentfield', "Field 'nonexistentfield' is not defined in the schema.")
    }
  })
  it("Update an user with an non-existent ID without triggering an error", async function () {
    let result = await UserService.updateOneUserById(new mongoose.Types.ObjectId())
    should(result).not.be.ok()
  })
  it("Update an user with an non-existent ID and trigger an error", async function () {
    let result = await UserService.updateOneUserById(new mongoose.Types.ObjectId(), {username : "Jean Erreur"}, { error_not_found: true }).should.be.rejectedWith(Object)
    should(result).have.property('type', 'NOT_FOUND')
    should(result).have.property('message', "User not found.")
  })
  it("Update an user with a null ID and trigger an error", async function () {
    let result = await UserService.updateOneUserById(null, {username : "Jean Erreur"}, { error_not_found: true }).should.be.rejectedWith(Object)
    should(result).have.property('type', 'NOT_FOUND')
    should(result).have.property('message', "User not found.")
  })
  it("Update an user with a null ID without triggering an error", async function () {
    let result = await UserService.updateOneUserById(null, {username : "Jean Erreur"}, { error_not_found: false })
    should(result).not.be.ok()
  })
})

describe('UserService - updateOneUserByUsername', function () {
  it('Update an user with success.', async function () {
    let email = "jeanupdate@gmail.com"
    let result = await UserService.updateOneUserByUsername("Jean Test", {email : email})
    should(result).have.property('username', userValidSchema.username)
    should(result).have.property('email', email)
    should(result).have.property('password', userValidSchema.password)
    should(result).have.property('location', userValidSchema.location)
    should(result).have.property('tags', userValidSchema.tags)
    should(result).have.property('_id')
    should(result).have.property('createdAt')
    should(result).have.property('updatedAt')
  })
  it('Update an user with an incorrect format', async function () {
    let email = {email : "jeanupdate@gmail.com"}
    let result = await UserService.updateOneUserByUsername("Jean Test", {email : email}).should.be.rejectedWith(Object)
    should(result).have.property('type', 'NOT_VALID_CAST')
    should(result).have.property('message', "One or more fields do not have the correct format.")
    should(result).have.property('fields')
    should(result.fields).have.property('email')
  })
  it("Update an user's required field with a void value.", async function () {
    let email = null
    try {
      await UserService.updateOneUserByUsername("Jean Test", {email : email})
      throw new Error ("Expected rejection on void value for a required field")
    } catch(error){
      should(error).have.property('type', 'NOT_VALID')
      should(error).have.property('fields')
      should(error.fields).have.property('email', 'Path `email` is required.')
    }  
  })
  it("Update an user's email with invalid email format.", async function () {
    let email = "jeanupdate@@gmail.com"
    try {
      await UserService.updateOneUserByUsername("Jean Test", {email : email})
      throw new Error("Expected rejection on invalid email format test")
    } catch (error) {
      should(error).have.property('type', 'NOT_VALID')
      should(error).have.property('fields')
      should(error.fields).have.property('email', 'Invalid email format.')
    }
  })
  it("Update an user's tags without enough tags.", async function () {
    let tags = [
        new mongoose.Types.ObjectId(),
        new mongoose.Types.ObjectId()
      ]
    try {
      await UserService.updateOneUserByUsername("Jean Test", {tags : tags})
      throw new Error("Expected rejection on not enough tags test")
    } catch (error) {
      should(error).have.property('type', 'NOT_VALID')
      should(error).have.property('fields')
      should(error.fields).have.property('tags', 'You must provide at least 3 tags.')
    }
  })
  it("Update an user's with an already taken username.", async function () {
    let username = "Jean Test"
    let newUser = await UserService.addOneUser(userValidSchema3)
    try {
      await UserService.updateOneUserByUsername(newUser.username, {username : username})
      throw new Error("Expected rejection on already taken username test")
    } catch (error) {
      should(error).have.property('type', 'DUPLICATE')
      should(error).have.property('fields')
      should(error.fields).have.property('username')
    }
  })
  it("Update an user's password with a too short one.", async function () {
    let password = "tooshort"
    try {
      await UserService.updateOneUserByUsername("Jean Test", {password : password})
      throw new Error("Expected rejection on too short password test")
    } catch (error) {
      should(error).have.property('type', 'NOT_VALID')
      should(error).have.property('fields')
      should(error.fields).have.property('password', 'Password is too short (12 characters minimum are required).')
    }
  })
  it("Update an user's username with forbidden characters.", async function () {
    let username = '<script>Jean Forbidden !!!</script>'
    try {
      await UserService.updateOneUserByUsername("Jean Test", {username : username})
      throw new Error("Expected rejection on forbidden username characters test")
    } catch (error) {
      should(error).have.property('type', 'NOT_VALID')
      should(error).have.property('fields')
      should(error.fields).have.property('username', 'Invalid characters detected. Use only letters, numbers, spaces, underscores, and dashes.')
    }
  })
  it("Update an user's location with forbidden characters.", async function () {
    let location = 'Paris_'
    try {
      await UserService.updateOneUserByUsername("Jean Test", {location : location})
      throw new Error("Expected rejection on forbidden location characters test")
    } catch (error) {
      should(error).have.property('type', 'NOT_VALID')
      should(error).have.property('fields')
      should(error.fields).have.property('location', 'Invalid characters detected. Use only letters, spaces, apostrophes, and dashes.')
    }
  })
  it("Update an user's role with an invalid one.", async function () {
    let role = "superadmin"
    try {
      await UserService.updateOneUserByUsername("Jean Test", {role : role})
      throw new Error("Expected rejection on invalid role test")
    } catch (error) {
      should(error).have.property('type', 'NOT_VALID')
      should(error).have.property('fields')
      should(error.fields).have.property('role', "Invalid value for 'role'. Allowed values are: user, admin.")
    }
  })
  it('Update a nonexistent field', async () => {
    try {
      await UserService.updateOneUserByUsername("Jean Test", {nonexistentfield : "You shall not pass"})
      throw new Error('Expected rejection on nonexistent fields test')
    } catch (error) {
      should(error).have.property('type', 'NOT_VALID')
      should(error).have.property('fields')
      should(error.fields).have.property('nonexistentfield', "Field 'nonexistentfield' is not defined in the schema.")
    }
  })
  it("Update an user with an non-existent username without triggering an error", async function () {
    let result = await UserService.updateOneUserByUsername("Jean Unfinded")
    should(result).not.be.ok()
  })
  it("Update an user with an non-existent username and trigger an error", async function () {
    let result = await UserService.updateOneUserByUsername("Jean Unfinded", {username : "Jean Erreur"}, { error_not_found: true }).should.be.rejectedWith(Object)
    should(result).have.property('type', 'NOT_FOUND')
    should(result).have.property('message', "User not found.")
  })
  it("Update an user with a null username and trigger an error", async function () {
    let result = await UserService.updateOneUserByUsername(null, {username : "Jean Erreur"}, { error_not_found: true }).should.be.rejectedWith(Object)
    should(result).have.property('type', 'NOT_FOUND')
    should(result).have.property('message', "User not found.")
  })
  it("Update an user with a null username without triggering an error", async function () {
    let result = await UserService.updateOneUserByUsername(null, {username : "Jean Erreur"}, { error_not_found: false })
    should(result).not.be.ok()
  })
})

describe('UserService - addFriend', function () {

  let friend

  it('Should add a friend successfully', async function () {  
    friend = await UserService.addOneUser(friendValidSchema)
    const result = await UserService.addFriend(userValidSchema._id, friend._id)
    should(result).have.property('friendlist').which.is.an.Array()
    should(result.friendlist.map(id => id.toString())).containEql(friend._id.toString())
  })

  it('Should not add the same friend twice (no duplicate)', async function () {
    try {
      await UserService.addFriend(userValidSchema._id, friend._id)
      throw new Error('Expected error on the same friend test.')
    } catch (err) {
      should(err).have.property('type', 'DUPLICATE')
      should(err).have.property('message', "The friend is already in the friendlist.")
    }
  })

  it('Should throw an error if userId has an invalid format', async function () {
    try {
      await UserService.addFriend("badFormat", friendValidSchema._id)
      throw new Error('Expected error on the invalid userId format test.')
    } catch (err) {
      should(err).be.an.Object()
      should(err).have.property('type', 'NOT_VALID_CAST')
      should(err).have.property('message').which.is.a.String().and.equal("One or more fields do not have the correct format.")
      should(err).have.property('fields')
      should(err.fields).have.property('_id')
    }
  })

  it('Should throw an error if friendId has an invalid format', async function () {
    try {
      await UserService.addFriend(userValidSchema._id, "invalidFriendId")
      throw new Error('Expected error on the invalid friendId format test.')
    } catch (err) {
      should(err).be.an.Object()
      should(err).have.property('type', 'NOT_VALID_CAST')
      should(err).have.property('message').which.is.a.String().and.equal("One or more fields do not have the correct format.")
      should(err).have.property('fields')
      should(err.fields).have.property('friendlist')
    }
  })

  it('Should return null if user does not exist', async function () {
    const fakeUserId = new mongoose.Types.ObjectId()
    const result = await UserService.addFriend(fakeUserId, friendValidSchema._id)
    should(result).not.be.ok()
  })

  it('Should return null if friendId is null', async function () {
    const result = await UserService.addFriend(userValidSchema._id, null)
    should(result).not.be.ok()
  })
})

describe('UserService - deleteOneUserById', function () {
  it('Delete an user with success.', async function () {
    let result = await UserService.deleteOneUserById(userValidSchema['_id'])
    should(result).have.property('username', userValidSchema.username)
    should(result).have.property('email')
    should(result).have.property('password', userValidSchema.password)
    should(result).have.property('location', userValidSchema.location)
    should(result).have.property('tags', userValidSchema.tags)
    should(result).have.property('_id')
    should(result).have.property('createdAt')
    should(result).have.property('updatedAt')
  })
  it('Delete an user with an incorrect format', async function () {
    let result = await UserService.deleteOneUserById("Jean Test").should.be.rejectedWith(Object)
    should(result).have.property('type', 'NOT_VALID_CAST')
    should(result).have.property('message', "One or more fields do not have the correct format.")
    should(result).have.property('fields')
    should(result.fields).have.property('_id')
  })
  it("Delete an user with an non-existent ID without triggering an error", async function () {
    let result = await UserService.deleteOneUserById(new mongoose.Types.ObjectId())
    should(result).not.be.ok()
  })
  it("Delete an user with an non-existent ID and trigger an error", async function () {
    let result = await UserService.deleteOneUserById(new mongoose.Types.ObjectId(), { error_not_found: true }).should.be.rejectedWith(Object)
    should(result).have.property('type', 'NOT_FOUND')
    should(result).have.property('message', "User not found.")
  })
  it("Delete an user with a null ID and trigger an error", async function () {
    let result = await UserService.deleteOneUserById(null, { error_not_found: true }).should.be.rejectedWith(Object)
    should(result).have.property('type', 'NOT_FOUND')
    should(result).have.property('message', "User not found.")
  })
  it("Delete an user with a null ID without triggering an error", async function () {
    let result = await UserService.deleteOneUserById(null, { error_not_found: false })
    should(result).not.be.ok()
  })
})

describe('UserService - deleteOneUserByUsername', function () {
  it('Delete an user with success.', async function () {
    await UserService.addOneUser(userValidSchema)
    let result = await UserService.deleteOneUserByUsername("Jean Test")
    should(result).have.property('username', userValidSchema.username)
    should(result).have.property('email', userValidSchema.email)
    should(result).have.property('password', userValidSchema.password)
    should(result).have.property('location', userValidSchema.location)
    should(result).have.property('tags', userValidSchema.tags)
    should(result).have.property('_id')
    should(result).have.property('createdAt')
    should(result).have.property('updatedAt')
  })
  it('Delete an user with an incorrect format', async function () {
    try {
      await UserService.deleteOneUserByUsername({username : "Jean Test"})
      throw new Error('Expected rejection on incorrect format test')
    } catch (error) {
      should(error).have.property('type', 'NOT_VALID_CAST')
      should(error).have.property('message', "One or more fields do not have the correct format.")
      should(error).have.property('fields')
      should(error.fields).have.property('username')
    }
  })
  it("Delete an user with an non-existent username without triggering an error", async function () {
    let result = await UserService.deleteOneUserByUsername("Jean Unfinded")
    should(result).not.be.ok()
  })
  it("Delete an user with an non-existent username and trigger an error", async function () {
    let result = await UserService.deleteOneUserByUsername("Jean Unfinded", { error_not_found: true }).should.be.rejectedWith(Object)
    should(result).have.property('type', 'NOT_FOUND')
    should(result).have.property('message', "User not found.")
  })
  it("Delete an user with a null username and trigger an error", async function () {
    let result = await UserService.deleteOneUserByUsername(null, { error_not_found: true }).should.be.rejectedWith(Object)
    should(result).have.property('type', 'NOT_FOUND')
    should(result).have.property('message', "User not found.")
  })
  it("Delete an user with a null username without triggering an error", async function () {
    let result = await UserService.deleteOneUserByUsername(null, { error_not_found: false })
    should(result).not.be.ok()
  })
})