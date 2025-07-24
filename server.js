const express = require('express')
const app = express()
const port = 3000

const mongoose = require('mongoose')

main().catch(err => console.error(err))

async function main () {
  await mongoose.connect('mongodb://127.0.0.1:27017/tagtrip')
}

app.listen(port, () => {
  console.log(`Server launched on port ${port} !`)
})