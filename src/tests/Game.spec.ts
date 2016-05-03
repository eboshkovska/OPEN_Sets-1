module OPENSets.Tests {
  describe("Game tests", () => {

    it("test1", () => {

      var logic = new OPENSets.Logic.Initial();
      var test = "First Jasmine test";

      expect(test).toBe("First Jasmine test");
      expect(logic.variable).toBe(1);
    });
  });
}
