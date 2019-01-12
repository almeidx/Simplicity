class Collection {
  constructor (data) {
    this.Data = data
  }

  has (id) {
    return new Promise((resolve, reject) => {
      this.Data.findById(id, (error, data) => {
        if (error) reject(error)
        resolve(!!data)
      })
    })
  }

  get (id) {
    return new Promise((resolve, reject) => {
      this.Data.findById(id, (error, data) => {
        if (error) reject(error)
        resolve(data)
      })
    })
  }

  create (id, data = {}, options = {}) {
    data._id = id
    return new Promise((resolve, reject) => {
      let item = new this.Data(data)
      item.save(options, (err, res) => {
        if (err) reject(err)
        resolve(res)
      })
    })
  }

  edit (id, data = {}) {
    return new Promise((resolve, reject) => {
      this.Data.updateOne({ _id: id }, data, (err, res) => {
        if (err) reject(err)
        resolve(res)
      })
    })
  }
}

module.exports = Collection
