import crypto from 'crypto';

export default {
    algorithm: 'aes-256-ctr',
    inputEncoding: 'utf8',
    outputEncoding: 'hex',

    encrypt(text, password)
    {
        let cipher  = crypto.createCipher(this.algorithm, password),
            crypted = cipher.update(text, this.inputEncoding, this.outputEncoding);

        crypted += cipher.final(this.outputEncoding);

        return crypted;
    },
    decrypt(text, password)
    {
        let decipher = crypto.createDecipher(this.algorithm, password),
            dec      = decipher.update(text, this.outputEncoding, this.inputEncoding);

        dec += decipher.final(this.inputEncoding);

        return dec;
    }
}