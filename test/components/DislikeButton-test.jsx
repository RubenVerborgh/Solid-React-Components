import React from 'react';
import { DislikeButton } from '../../src/';
import { render, fireEvent, cleanup } from 'react-testing-library';
import MockPromise from 'jest-mock-promise';
import data from '@solid/query-ldflex';
import useLDflex from '../../src/hooks/useLDflex';

jest.mock('../../src/hooks/useLDflex', () => require('../__mocks__/useLDflex'));

const currentUrl = 'https://example.org/page/#fragment';
const dislike = 'https://www.w3.org/ns/activitystreams#Dislike';

describe('A DislikeButton', () => {
  let button;
  beforeAll(() => {
    window.location.href = currentUrl;
  });
  afterEach(cleanup);

  describe('without attributes', () => {
    const findExpression = `[${currentUrl}].findActivity("${dislike}")`;
    const createExpression = `[${currentUrl}].createActivity("${dislike}")`;
    const deleteExpression = `[${currentUrl}].deleteActivity("${dislike}")`;

    beforeEach(() => {
      data.resolve.mockClear();
      const { container } = render(<DislikeButton/>);
      button = container.firstChild;
    });

    it('has the "solid" class', () => {
      expect(button).toHaveClass('solid');
    });

    it('has the "activity" class', () => {
      expect(button).toHaveClass('solid');
    });

    it('has the "dislike" class', () => {
      expect(button).toHaveClass('dislike');
    });

    it('does not have the "performed" class', () => {
      expect(button).not.toHaveClass('performed');
    });

    it('has "Dislike this page" as a label', () => {
      expect(button).toHaveProperty('innerHTML', 'Dislike this page');
    });

    describe('when no activity exists', () => {
      beforeEach(() => {
        useLDflex.resolve(findExpression, undefined);
      });

      it('has "Dislike this page" as a label', () => {
        expect(button).toHaveProperty('innerHTML', 'Dislike this page');
      });

      it('does not have the "performed" class', () => {
        expect(button).not.toHaveClass('performed');
      });

      describe('when clicked', () => {
        let activity;
        beforeEach(() => {
          activity = new MockPromise();
          data.resolve.mockReturnValue(activity);
          fireEvent.click(button);
        });

        it('has "You disliked this page" as a label', () => {
          expect(button).toHaveProperty('innerHTML', 'You disliked this page');
        });

        it('has the "performed" class', () => {
          expect(button).toHaveClass('performed');
        });

        it('creates an activity', () => {
          expect(data.resolve).toHaveBeenCalledWith(createExpression);
        });

        describe('when activity creation succeeds', () => {
          beforeEach(() => {
            // mute `act` warning caused by asynchronous `reject`,
            // since no workaround currently exists
            // https://github.com/facebook/jest/issues/7151
            console.mute();
            activity.resolve({});
          });
          afterEach(() => {
            console.unmute();
          });

          it('has "You disliked this page" as a label', () => {
            expect(button).toHaveProperty('innerHTML', 'You disliked this page');
          });

          it('has the "performed" class', () => {
            expect(button).toHaveClass('performed');
          });
        });

        describe('when activity creation fails', () => {
          beforeEach(() => {
            console.mute();
            activity.reject(new Error());
          });
          afterEach(() => {
            console.unmute();
          });

          it('has "Dislike this page" as a label', () => {
            expect(button).toHaveProperty('innerHTML', 'Dislike this page');
          });

          it('does not have the "performed" class', () => {
            expect(button).not.toHaveClass('performed');
          });
        });
      });
    });

    describe('when an activity exists', () => {
      beforeEach(() => {
        useLDflex.resolve(findExpression, {});
      });

      it('has "You disliked this page" as a label', () => {
        expect(button).toHaveProperty('innerHTML', 'You disliked this page');
      });

      it('has the "performed" class', () => {
        expect(button).toHaveClass('performed');
      });

      describe('when clicked', () => {
        let activity;
        beforeEach(() => {
          activity = new MockPromise();
          data.resolve.mockReturnValue(activity);
          fireEvent.click(button);
        });

        it('has "Dislike this page" as a label', () => {
          expect(button).toHaveProperty('innerHTML', 'Dislike this page');
        });

        it('does not have the "performed" class', () => {
          expect(button).not.toHaveClass('performed');
        });

        it('creates an activity', () => {
          expect(data.resolve).toHaveBeenCalledWith(deleteExpression);
        });

        describe('when activity creation succeeds', () => {
          beforeEach(() => {
            console.mute();
            activity.resolve({});
          });
          afterEach(() => {
            console.unmute();
          });

          it('has "Dislike this page" as a label', () => {
            expect(button).toHaveProperty('innerHTML', 'Dislike this page');
          });

          it('does not have the "performed" class', () => {
            expect(button).not.toHaveClass('performed');
          });
        });

        describe('when activity creation fails', () => {
          beforeEach(() => {
            console.mute();
            activity.reject(new Error());
          });
          afterEach(() => {
            console.unmute();
          });

          it('has "You disliked this page" as a label', () => {
            expect(button).toHaveProperty('innerHTML', 'You disliked this page');
          });

          it('has the "performed" class', () => {
            expect(button).toHaveClass('performed');
          });
        });
      });
    });
  });

  describe('with an object', () => {
    const object = 'https://example.org/#thing';
    const findExpression = `["${object}"].findActivity("${dislike}")`;
    const createExpression = `["${object}"].createActivity("${dislike}")`;

    beforeEach(() => {
      data.resolve.mockClear();
      const { container } = render(<DislikeButton object={object}/>);
      button = container.firstChild;
    });

    describe('when no activity exists', () => {
      beforeEach(() => {
        useLDflex.resolve(findExpression, undefined);
      });

      it('has "Dislike" as a label', () => {
        expect(button).toHaveProperty('innerHTML', 'Dislike');
      });

      describe('when clicked', () => {
        let activity;
        beforeEach(() => {
          activity = new MockPromise();
          data.resolve.mockReturnValue(activity);
          fireEvent.click(button);
        });

        it('has "Disliked" as a label', () => {
          expect(button).toHaveProperty('innerHTML', 'Disliked');
        });

        it('creates an activity', () => {
          expect(data.resolve).toHaveBeenCalledWith(createExpression);
        });
      });
    });
  });

  describe('with children', () => {
    beforeEach(() => {
      data.resolve.mockClear();
      const { container } = render(<DislikeButton>this thing</DislikeButton>);
      button = container.firstChild;
    });

    it('has "Dislike this thing" as a label', () => {
      expect(button).toHaveProperty('innerHTML', 'Dislike this thing');
    });
  });
});
