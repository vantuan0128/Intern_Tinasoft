import { SetMetadata } from "@nestjs/common";
import { Position } from "src/enums/position.enum";

export const POSITIONS_KEY = 'positions';
export const Positions = (...positions: Position[]) => SetMetadata(POSITIONS_KEY, positions);