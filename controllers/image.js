const Clarifai = require('clarifai');

const app = new Clarifai.App({
    apiKey: '0ae7cd6cb290496a96bafa0c291479b0'
});

const handleApiCall = (req,res) => {
    app.models
        .predict(Clarifai.FACE_DETECT_MODEL,
            req.body.input)
        .then(data => {
            console.log(data);
            res.json(data)
        })
        .catch(err =>  res.status(400).json('unable_to_work_with_API'));
}

const handleImage = (req,res,db) => {
    const { id } = req.body;
    db('users')
        .where({'id': id})
        .increment('entries',1) /*incremen entries for a signed in user when she pushes Detect button*/
        .returning('entries') /*return new entries value*/
        .then(entries => {
            res.json(entries[[0]]); /*put a new entries value to query result to work with*/
        })
        .catch(err =>  res.status(400).json('error_getting_user_entries'))
}

module.exports ={
    handleImage,
    handleApiCall
}