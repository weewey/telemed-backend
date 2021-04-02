import {get} from "lodash";

class EnvConfig {
    public get nodeEnvironment(): string {
        return get(process.env, "NODE_ENV", "local");
    }

    public get isTestEnvironment(): boolean {
        return ["local", "dev", "test"].includes(this.nodeEnvironment);
    }
}

export default new EnvConfig();
