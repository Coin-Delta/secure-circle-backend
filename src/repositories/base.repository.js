import logger from "../logger/winston.logger.js";
class BaseRepository {
  constructor(model) {
    this.model = model;
  }

  getModel = () => {
    return this.model;
  };

  findAll = async (filter, populateOptions = []) => {
    try {
      const result = await this.model
        .find({ ...filter })
        .populate(populateOptions);
      return result;
    } catch (error) {
      logger.error("Something went wrong in base repo", error);
      throw error;
    }
  };

  findOne = async (filter) => {
    try {
      const result = await this.model.findOne({ ...filter });
      return result;
    } catch (error) {
      logger.error("Something went wrong in base repo", error);
      throw error;
    }
  };
  findById = async (id) => {
    try {
      const result = await this.model.findById(id);
      return result;
    } catch (error) {
      logger.error("Something went wrong in base repo", error);
      throw error;
    }
  };

  create = async (data) => {
    try {
      const result = await this.model.create(data);
      return result;
    } catch (error) {
      logger.error("Something went wrong in base repo", error);
      throw error;
    }
  };

  delete = async (id) => {
    try {
      const result = await this.model.findByIdAndDelete(id);
      return result;
    } catch (error) {
      logger.error("Something went wrong in base repo", error);
      throw error;
    }
  };

  deleteMany = async (filter) => {
    try {
      const result = await this.model.deleteMany({ ...filter });
      return result;
    } catch (error) {
      logger.error("Something went wrong in base repo", error);
      throw error;
    }
  };
  update = async (id, data) => {
    try {
      const result = await this.model.findByIdAndUpdate(id, data, {
        new: true,
      });
      return result;
    } catch (error) {
      logger.error("Something went wrong in base repo", error);
      throw error;
    }
  };
  async aggregatePaginate(pipeline = [], paginationOptions = {}) {
    try {
      const aggregation = this.model.aggregate(pipeline);
      const options = {
        ...paginationOptions,
      };
      const result = await this.model.aggregatePaginate(aggregation, options);

      return result;
    } catch (error) {
      logger.error("Something went wrong in base repo", error);
      throw error;
    }
  }
  async aggregate(pipeline = []) {
    try {
      const result = await this.model.aggregate(pipeline).exec();
      return result;
    } catch (error) {
      logger.error("Something went wrong in base repo", error);
      throw error;
    }
  }
}

export default BaseRepository;
