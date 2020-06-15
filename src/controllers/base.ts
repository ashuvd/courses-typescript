import express from "express";
import passport from "passport";

export class BaseController {
  public path = '/';
  public router = express.Router();

  public init(passport: passport.PassportStatic) {
    this.initRouter(passport);
  }
  protected initRouter(passport: passport.PassportStatic){}
}
