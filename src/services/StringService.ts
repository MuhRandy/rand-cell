export default class StringService {
  static splitByHyphen(string: string) {
    return string.split(" - ");
  }

  static splitByFirstHyphen(string: string) {
    return string.split(/-(.*)/s);
  }

  static bracketCleaner(string: string) {
    return string.replace("(", "").replace(")", "");
  }
}
