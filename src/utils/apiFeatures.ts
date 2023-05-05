export class ApiFeatures {

    // pagination
    static async pagination(page, resultPerPage, query) {
        const currentPage = Number(page) || 1;
        const skipPage = resultPerPage * (currentPage - 1);

        const result = await query.offset(skipPage).limit(resultPerPage).getMany();
        return result;
    }

    // search 
    static async search(param, query) {
        return false;
    }

    // filter

}
