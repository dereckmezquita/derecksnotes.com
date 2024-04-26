import mongoose from 'mongoose';

const GeolocationSchema = new mongoose.Schema({
    ip: String,
    country: String,
    countryCode: String,
    flag: String,
    regionName: String,
    city: String,
    firstUsed: Date,
    lastUsed: Date
});

export default GeolocationSchema;
