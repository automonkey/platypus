var chai = require('chai');
var anOjpResult = require('./utils/ojpResultBuilder').anOjpResult;
var processOjpResults = require('../lib/ojpResultProcessing').processOjpResults;

chai.should();
chai.use(require('chai-array'));
chai.use(require('chai-things'));

describe('Result processing', function() {

  describe('Result order', function() {

    it('Should sort results by date', function() {
      function dateWithHour(hour) {
        return new Date(2016, 01, 09, hour, 00, 00, 000);
      }

      var ojpResults = [
        anOjpResult()
        .withScheduledDepartureTime(dateWithHour(10))
        .withDestination('10am').build(),

        anOjpResult()
        .withScheduledDepartureTime(dateWithHour(11))
        .withDestination('11am').build(),

        anOjpResult()
        .withScheduledDepartureTime(dateWithHour(09))
        .withDestination('9am').build()
      ];

      var results = processOjpResults([], ojpResults);

      results.should.have.firstValue.with.property('destinationStation', '9am'),
      results.should.have.secondValue.with.property('destinationStation', '10am'),
      results.should.have.thirdValue.with.property('destinationStation', '11am')
    });

    describe('When dates are equal', function() {
      var testDate = new Date();

      function resultForDestination(destination) {
        return anOjpResult()
          .withScheduledDepartureTime(testDate)
          .withDestination(destination).build();
      }

      it('Should prioritize by order of listed destinations (case insensitive)', function() {

        var ojpResults = [
          resultForDestination('1ST-PRIORITY'),
          resultForDestination('2nd-priority'),
          resultForDestination('3RD-PRIORITY'),
          resultForDestination('3RD-PRIORITY'),
          resultForDestination('2nd-priority'),
          resultForDestination('1ST-PRIORITY')
        ];

        var results = processOjpResults(['1st-priority', '2ND-PRIORITY', '3rd-priority'], ojpResults);

        results.should.have.atIndex(0).with.property('destinationStation', '1ST-PRIORITY')
        results.should.have.atIndex(1).with.property('destinationStation', '1ST-PRIORITY')
        results.should.have.atIndex(2).with.property('destinationStation', '2nd-priority')
        results.should.have.atIndex(3).with.property('destinationStation', '2nd-priority')
        results.should.have.atIndex(4).with.property('destinationStation', '3RD-PRIORITY')
        results.should.have.atIndex(5).with.property('destinationStation', '3RD-PRIORITY')
      });

      it('Should make unlisted destinations lowest priority', function() {

        // User may have entered the CRC for a 'station group' as one of the
        // destinations, in which case some result destinations may not be
        // listed in the requested destinations. Prioritise exact matches.

        var ojpResults = [
          resultForDestination('unlisted-destination'),
          resultForDestination('listed-destination'),
          resultForDestination('unlisted-destination'),
        ];

        var results = processOjpResults(['listed-destination'], ojpResults);
        results.should.have.firstValue.with.property('destinationStation', 'listed-destination')
        results.should.have.secondValue.with.property('destinationStation', 'unlisted-destination')
        results.should.have.thirdValue.with.property('destinationStation', 'unlisted-destination')
      });
    });
  });
});

