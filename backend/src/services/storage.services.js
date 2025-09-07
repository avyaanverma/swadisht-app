/* aisi koi bhi services jo change ho sakti hain woh saai services hum services folder meh aate hain  */
// .upload() method to upload files to the ImageKit Media Library
// upload() method requires at least the file and the fileName parameter 
// returns a callback with the error and result as arguments


const ImageKit = require("imagekit")

const imagekit = new ImageKit({
    publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
    privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
    urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT

})

async function uploadFile(file, fileName){
    const result = await imagekit.upload({
        file: file, // required
        fileName: fileName
    })

    return result
}

module.exports = {
    uploadFile
}