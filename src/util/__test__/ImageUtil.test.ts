import ImageUtil from '../ImageUtil';

test('if it creates the guild default icon', () => {
  const buffer = ImageUtil.renderGuildIcon('A');
  expect(buffer).toMatchSnapshot();
});
