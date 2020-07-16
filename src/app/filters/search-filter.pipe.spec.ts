import { SearchFilterPipe } from './search-filter.pipe';

describe('SearchFilterPipe', () => {
  it('create an instance', () => {
    const pipe = new SearchFilterPipe();
    expect(pipe).toBeTruthy();
  });

  it('should filter based on input search', () => {
    const input = 'Bulla';
    const list = [
      {
        abnormality: 'Anatomical variants',
        names: [
          'Aortic Arch variants',
          'Azygos fissure',
          'Cervical rib',
          'Thymus',
        ],
      },
      {
        abnormality: 'Bronchiectasis',
        names: [],
      },
      {
        abnormality: 'Bronchitis',
        names: [],
      },
      {
        abnormality: 'Bulla',
        names: [],
      },
    ];
    const pipe = new SearchFilterPipe();
    const result = pipe.transform(list, input);
    expect(result[0].abnormality).toBe('Bulla');
  });
  it('should filter based on remove input search', () => {
    const input = '';
    const list = [
      {
        abnormality: 'Anatomical variants',
        names: [
          'Aortic Arch variants',
          'Azygos fissure',
          'Cervical rib',
          'Thymus',
        ],
      },
      {
        abnormality: 'Bronchiectasis',
        names: [],
      },
      {
        abnormality: 'Bronchitis',
        names: [],
      },
      {
        abnormality: 'Bulla',
        names: [],
      },
    ];
    const pipe = new SearchFilterPipe();
    const result = pipe.transform(list, input);
    expect(result).toBe(list);
  });
});
