export enum FabricCAServerCommand {
  COMPLETION = "completion",
  HELP = "help",
  INIT = "init",
  START = "start",
  VERSION = "version",
}

export enum FabricCAServerDBType {
  SQLITE3 = "sqlite3",
  POSTGRES = "postgres",
  MYSQL = "mysql",
}

export enum FabricCAServerCurveName {
  FP256BN = "amcl.Fp256bn",
  BN254 = "gurvy.Bn254",
  FP256MIRACLBN = "amcl.Fp256Miraclbn",
}

export enum FabricCAServerEnrollmentType {
  X509 = "x509",
  IDEMIX = "idemix",
}