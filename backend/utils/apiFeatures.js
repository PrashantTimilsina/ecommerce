class ApiFeatures {
  constructor(query, queryStr) {
    this.query = query;
    this.queryStr = queryStr;
  }
  filter() {
    const queryObj = { ...this.queryStr };
    const excludedFields = ["page", "sort", "search", "limit", "select"];
    excludedFields.forEach((el) => delete queryObj[el]);
    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);
    const parsedStr = JSON.parse(queryStr);
    this.query = this.query.find(parsedStr);
    return this;
  }
  search(searchFields = []) {
    if (this.queryStr.search && searchFields.length > 0) {
      const search = this.queryStr.search.trim();
      const searchCondition = searchFields.map((field) => ({
        [field]: { $regex: search, $options: "i" },
      }));
      this.query = this.query.find({ $or: searchCondition });
    }
    return this;
  }
  select() {
    if (this.queryStr.select) {
      const fields = this.queryStr.select.split(",").join(" ");
      this.query = this.query.select(fields);
    } else {
      this.query = this.query.select("-__v");
    }
    return this;
  }
  sort() {
    if (this.queryStr.sort) {
      const sortOptions = this.queryStr.sort.split(",").join(" ");
      this.query = this.query.sort(sortOptions);
    } else {
      this.query = this.query.sort("-createdAt");
    }
    return this;
  }

  paginate() {
    const page = Math.max(parseInt(this.queryStr.page) || 1, 1);

    const limit = Math.min(
      Math.max(parseInt(this.queryStr.limit) || 10, 1),
      100,
    );
    const skip = (page - 1) * limit;
    this.query = this.query.skip(skip).limit(limit);
    return this;
  }
}
export default ApiFeatures;
