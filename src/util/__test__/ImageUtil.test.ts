import ImageUtil from '../ImageUtil';

test('if create guild default icon', () => {
  const buffer = ImageUtil.renderGuildIcon('A');
  expect(buffer).toMatchSnapshot();
});
