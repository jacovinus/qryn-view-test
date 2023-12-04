import { nanoid } from "nanoid";

// type : LOGS
export class LinkedFieldItem {
    id: any;
    dataSource: any;
    ds_id: any;
    name: any;
    regex: any;
    query: any;
    urlLabel: any;
    url: any;
    internalLink: any;
    linkType: any;
    constructor() {
        this.id = nanoid();
        this.dataSource = "Logs";
        this.ds_id = "logs";
        this.name = "traceID";
        this.regex = '^.*?"traceID" ="(w+)".*$/';
          // eslint-disable-next-line
        this.query = "${__value.raw}";
        this.urlLabel = "";
        this.url = "";
        this.internalLink = true;
        this.linkType = "Traces";
    }

    create() {
        const {
            id,
            dataSource,
            ds_id,
            name,
            regex,
            query,
            urlLabel,
            url,
            internalLink,
            linkType,
        } = this;
        return {
            id,
            dataSource,
            ds_id,
            name,
            regex,
            query,
            urlLabel,
            url,
            internalLink,
            linkType,
        };
    }
}
