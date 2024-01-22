import "dotenv/config";
declare function mongodbConnection(): Promise<void>;
export default mongodbConnection;
