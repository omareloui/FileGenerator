import mongoose from "mongoose";

const Schema = mongoose.Schema;

const <%= kebabToPascal(name) %>Schema = new Schema({});

export default mongoose.model("<%= name %>", <%= kebabToPascal(name) %>Schema);
