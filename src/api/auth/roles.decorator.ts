import { SetMetadata } from "@nestjs/common";
import { Role } from "src/helpers/role.enum";

export const Roles = (...roles: Role[]) => SetMetadata('roles', roles);