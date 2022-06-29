import mongoose from "mongoose";

const Schema = mongoose.Schema;

const <%= CaseConvertor.kebabToPascal(name) %>Schema = new Schema({});

export default mongoose.model("<%= name %>", <%= CaseConvertor.kebabToPascal(name) %>Schema);
