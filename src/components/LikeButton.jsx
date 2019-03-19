import React from 'react';
import data from '@solid/query-ldflex';
import ActivityButton from './ActivityButton';

const { as } = data.context;

/** Button to view and perform a "Like" action on an item. */
export default function LikeButton({
  object,
  children = object ? null : 'this page',
  likeText = 'Like',
  likedText = children ? 'You liked' : 'Liked',
  likeLabel = children ? [likeText, ' ', children] : likeText,
  likedLabel = children ? [likedText, ' ', children] : likedText,
  ...props
}) {
  return <ActivityButton activityType={`${as}Like`} object={object}
    suggestActivity={likeLabel} displayActivity={likedLabel} {...props} />;
}
