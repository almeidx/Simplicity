module.exports = function Error(error) {
    if (error.message == 'Unexpected server response: 520')
        console.log("Cant connect to Discords API, Retrying...");
    else if (error.message == 'read ECONNRESET')
        console.log("Connection Reset! Reconnecting...");
    else 
        console.error(error);
};