const mongoose = require('mongoose')
const mongoURI = 'mongodb+srv://takeaway:takeaway123@cluster0.lrecrsi.mongodb.net/takeaway?retryWrites=true&w=majority'
mongoose.set('strictQuery', false)

const mongoDB = async () => {
    await mongoose.connect(mongoURI, { useNewUrlParser: true }, async (err, result) => {
        if (err) {
            console.log('dbc ' + err)
        } else {
            console.log('database connected')
            const fetchData = await mongoose.connection.db.collection('fooditems');
            const data = await fetchData.find({}).toArray()

            const foodCategory = await mongoose.connection.db.collection('foodcategory');
            const category = await foodCategory.find({}).toArray()
            if (err) {
                console.log(err.message)
            } else {
                global.fooditems = data
                global.foodCategory = category
            }
        
        }
    })
}

module.exports = mongoDB