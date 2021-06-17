import { createTest, destroyVM } from '../util';
    import City from 'packages/city';
    
    describe('City', () => {
      let vm;
      afterEach(() => {
        destroyVM(vm);
      });
      
      it('create', () => {
        vm = createTest(City, true);
        expect(vm.$el).to.exist;
      });
    });
    
