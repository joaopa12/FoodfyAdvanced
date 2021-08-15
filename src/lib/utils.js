module.exports = {
    date(timestamp){
        const date = new Date(timestamp)
        const year = date.getFullYear()
        const month = `0${date.getMonth() + 1}`.slice(-2) 
        const day = `0${date.getDate() + 1}`.slice(-2) 

        return {
            day,
            month,
            year,
            iso:`${year}-${month}-${day}`
        }
    },
    feature(value){
        if(value === "true"){
            return true
        } else {
            return false
        }
    }
}