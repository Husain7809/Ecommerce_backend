import { v2 } from 'cloudinary';

export class CloudConfig {

    // cloud config
    static cloudConfig() {
        v2.config({
            cloud_name: "dds8ssut1",
            api_key: "559325466699422",
            api_secret: "eydjCXc-ol1-X0BXuDAoO8Hz97Y"
        });
    }
}

    // CloudConfig.cloudConfig();
    // const fileUpload = await v2.uploader.upload(file.path, { public_id: file.filename })
    // fs.unlinkSync(file.path);