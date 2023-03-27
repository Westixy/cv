with import <nixpkgs> {};

stdenv.mkDerivation {
  name = "env";
  buildInputs = [
    nodejs
  ];
  shellHook = ''
    DEBUG=false
  '';
}