import React from 'react';
import { FollowButton } from '../../src/';
import { render, fireEvent, cleanup } from '@testing-library/react';
import MockPromise from 'jest-mock-promise';
import data from '@solid/query-ldflex';
import useLDflex from '../../src/hooks/useLDflex';

jest.mock('../../src/hooks/useLDflex', () => require('../__mocks__/useLDflex'));

const currentUrl = 'https://example.org/page/#fragment';
const follow = 'https://www.w3.org/ns/activitystreams#Follow';

describe('A FollowButton', () => {
  let button;
  beforeAll(() => {
    window.location.href = currentUrl;
  });
  afterEach(cleanup);

  describe('without attributes', () => {
    const findExpression = `[${currentUrl}].findActivity("${follow}")`;
    const createExpression = `[${currentUrl}].createActivity("${follow}")`;
    const deleteExpression = `[${currentUrl}].deleteActivity("${follow}")`;

    beforeEach(() => {
      data.resolve.mockClear();
      const { container } = render(<FollowButton/>);
      button = container.firstChild;
    });

    it('has the "solid" class', () => {
      expect(button).toHaveClass('solid');
    });

    it('has the "activity" class', () => {
      expect(button).toHaveClass('solid');
    });

    it('has the "follow" class', () => {
      expect(button).toHaveClass('follow');
    });

    it('does not have the "performed" class', () => {
      expect(button).not.toHaveClass('performed');
    });

    it('has "Follow this page" as a label', () => {
      expect(button).toHaveProperty('innerHTML', 'Follow this page');
    });

    describe('when no activity exists', () => {
      beforeEach(() => {
        useLDflex.resolve(findExpression, undefined);
      });

      it('has "Follow this page" as a label', () => {
        expect(button).toHaveProperty('innerHTML', 'Follow this page');
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

        it('has "You follow this page" as a label', () => {
          expect(button).toHaveProperty('innerHTML', 'You follow this page');
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

          it('has "You follow this page" as a label', () => {
            expect(button).toHaveProperty('innerHTML', 'You follow this page');
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

          it('has "Follow this page" as a label', () => {
            expect(button).toHaveProperty('innerHTML', 'Follow this page');
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

      it('has "You follow this page" as a label', () => {
        expect(button).toHaveProperty('innerHTML', 'You follow this page');
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

        it('has "Follow this page" as a label', () => {
          expect(button).toHaveProperty('innerHTML', 'Follow this page');
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

          it('has "Follow this page" as a label', () => {
            expect(button).toHaveProperty('innerHTML', 'Follow this page');
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

          it('has "You follow this page" as a label', () => {
            expect(button).toHaveProperty('innerHTML', 'You follow this page');
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
    const findExpression = `["${object}"].findActivity("${follow}")`;
    const createExpression = `["${object}"].createActivity("${follow}")`;

    beforeEach(() => {
      data.resolve.mockClear();
      const { container } = render(<FollowButton object={object}/>);
      button = container.firstChild;
    });

    describe('when no activity exists', () => {
      beforeEach(() => {
        useLDflex.resolve(findExpression, undefined);
      });

      it('has "Follow" as a label', () => {
        expect(button).toHaveProperty('innerHTML', 'Follow');
      });

      describe('when clicked', () => {
        let activity;
        beforeEach(() => {
          activity = new MockPromise();
          data.resolve.mockReturnValue(activity);
          fireEvent.click(button);
        });

        it('has "Following" as a label', () => {
          expect(button).toHaveProperty('innerHTML', 'Following');
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
      const { container } = render(<FollowButton>this thing</FollowButton>);
      button = container.firstChild;
    });

    it('has "Follow this thing" as a label', () => {
      expect(button).toHaveProperty('innerHTML', 'Follow this thing');
    });
  });
});
