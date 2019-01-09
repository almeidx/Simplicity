module.exports = function Error (error) {
  if (error.message === 'Unexpected server response: 520') {
    console.log('Cant connect to Discords API, Retrying...')
  } else if (error.message === 'read ECONNRESET') {
    console.log('Connection Reset! Reconnecting...')
  } else {
    this.user.channels.get('532368809105948701').send(error)
    console.error(error)
  }
}
