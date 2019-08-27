import React from 'react';
import { LikeButton } from '../../src/';
import { render, fireEvent, cleanup } from '@testing-library/react';
import MockPromise from 'jest-mock-promise';
import data from '@solid/query-ldflex';
import useLDflex from '../../src/hooks/useLDflex';

jest.mock('../../src/hooks/useLDflex', () => require('../__mocks__/useLDflex'));

const currentUrl = 'https://example.org/page/#fragment';
const like = 'https://www.w3.org/ns/activitystreams#Like';

describe('A LikeButton', () => {
  let button;
  beforeAll(() => {
    window.location.href = currentUrl;
  });
  afterEach(cleanup);

  describe('without attributes', () => {
    const findExpression = `[${currentUrl}].findActivity("${like}")`;
    const createExpression = `[${currentUrl}].createActivity("${like}")`;
    const deleteExpression = `[${currentUrl}].deleteActivity("${like}")`;

    beforeEach(() => {
      data.resolve.mockClear();
      const { container } = render(<LikeButton/>);
      button = container.firstChild;
    });

    it('has the "solid" class', () => {
      expect(button).toHaveClass('solid');
    });

    it('has the "activity" class', () => {
      expect(button).toHaveClass('solid');
    });

    it('has the "like" class', () => {
      expect(button).toHaveClass('like');
    });

    it('does not have the "performed" class', () => {
      expect(button).not.toHaveClass('performed');
    });

    it('has "Like this page" as a label', () => {
      expect(button).toHaveProperty('innerHTML', 'Like this page');
    });

    describe('when no activity exists', () => {
      beforeEach(() => {
        useLDflex.resolve(findExpression, undefined);
      });

      it('has "Like this page" as a label', () => {
        expect(button).toHaveProperty('innerHTML', 'Like this page');
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

        it('has "You liked this page" as a label', () => {
          expect(button).toHaveProperty('innerHTML', 'You liked this page');
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

          it('has "You liked this page" as a label', () => {
            expect(button).toHaveProperty('innerHTML', 'You liked this page');
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

          it('has "Like this page" as a label', () => {
            expect(button).toHaveProperty('innerHTML', 'Like this page');
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

      it('has "You liked this page" as a label', () => {
        expect(button).toHaveProperty('innerHTML', 'You liked this page');
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

        it('has "Like this page" as a label', () => {
          expect(button).toHaveProperty('innerHTML', 'Like this page');
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

          it('has "Like this page" as a label', () => {
            expect(button).toHaveProperty('innerHTML', 'Like this page');
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

          it('has "You liked this page" as a label', () => {
            expect(button).toHaveProperty('innerHTML', 'You liked this page');
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
    const findExpression = `["${object}"].findActivity("${like}")`;
    const createExpression = `["${object}"].createActivity("${like}")`;

    beforeEach(() => {
      data.resolve.mockClear();
      const { container } = render(<LikeButton object={object}/>);
      button = container.firstChild;
    });

    describe('when no activity exists', () => {
      beforeEach(() => {
        useLDflex.resolve(findExpression, undefined);
      });

      it('has "Like" as a label', () => {
        expect(button).toHaveProperty('innerHTML', 'Like');
      });

      describe('when clicked', () => {
        let activity;
        beforeEach(() => {
          activity = new MockPromise();
          data.resolve.mockReturnValue(activity);
          fireEvent.click(button);
        });

        it('has "Liked" as a label', () => {
          expect(button).toHaveProperty('innerHTML', 'Liked');
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
      const { container } = render(<LikeButton>this thing</LikeButton>);
      button = container.firstChild;
    });

    it('has "Like this thing" as a label', () => {
      expect(button).toHaveProperty('innerHTML', 'Like this thing');
    });
  });
});
