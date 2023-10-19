import { isValidDirectory } from '../src/utils'
import { expect } from 'chai'

context('checkDirectory', () => {
  it('invalid empty source', () => {
    const result = isValidDirectory('', [])
    expect(result).to.be.false
  })

  context('with exact match', () => {
    it('valid exact root', () => {
      const result = isValidDirectory('exact', ['exact'])
      expect(result).to.be.true
    })

    it('invalid extra slash', () => {
      const result = isValidDirectory('/exact', ['exact'])
      expect(result).to.be.false
    })

    it('valid exact root with ending slash', () => {
      const result = isValidDirectory('exact/', ['exact'])
      expect(result).to.be.true
    })

    it('valid exact root/subdirectory', () => {
      const result = isValidDirectory('exact/other', ['exact/other'])
      expect(result).to.be.true
    })

    it('valid exact root/subdirectory with ending slash', () => {
      const result = isValidDirectory('exact/other/', ['exact/other'])
      expect(result).to.be.true
    })
  })

  context('with starts', () => {
    describe('only one star', () => {
      it('valid any root', () => {
        const result = isValidDirectory('exact', ['*'])
        expect(result).to.be.true
      })

      it('valid any root with ending slash', () => {
        const result = isValidDirectory('exact/', ['*'])
        expect(result).to.be.true
      })

      it('invalid for root with subdirectories', () => {
        const result = isValidDirectory('exact/other', ['*'])
        expect(result).to.be.false
      })
    })

    describe('one star and one subdirectory', () => {
      it('valid any root and the exact subdirectory', () => {
        const result = isValidDirectory('exact/test', ['*/test'])
        expect(result).to.be.true
      })

      it('invalid any root and the wrong subdirectory', () => {
        const result = isValidDirectory('exact/fail', ['*/test'])
        expect(result).to.be.false
      })
    })

    describe('one start in the last subdirectory', () => {
      it('invalid wrong root', () => {
        const result = isValidDirectory('fail/pass', ['test/*'])
        expect(result).to.be.false
      })

      it('valid the exact root and any subdirectory', () => {
        const result = isValidDirectory('test/pass', ['test/*'])
        expect(result).to.be.true
      })

      it('invalid the exact root and more subdirectories than expected', () => {
        const result = isValidDirectory('test/pass/fail', ['test/*'])
        expect(result).to.be.false
      })
    })
  })

  context('with GlobStart', () => {
    describe('only one GlobStart', () => {
      it('valid any root', () => {
        const result = isValidDirectory('exact', ['**'])
        expect(result).to.be.true
      })
    })

    describe('only one GlobStart at the end', () => {
      it('valid the exact root directory and any number of subdirectories', () => {
        expect(isValidDirectory('exact', ['exact/**'])).to.be.false
        expect(isValidDirectory('other', ['exact/**'])).to.be.false
        expect(isValidDirectory('exact/', ['exact/**'])).to.be.true
        expect(isValidDirectory('exact/1', ['exact/**'])).to.be.true
        expect(isValidDirectory('exact/1/2', ['exact/**'])).to.be.true
        expect(isValidDirectory('exact/1/2/', ['exact/**'])).to.be.true
      })
    })

    describe('only one GlobStart in the middle', () => {
      it('valid the exact root directory and any number of subdirectories ending in the expected one', () => {
        expect(isValidDirectory('fail', ['main/**/other'])).to.be.false
        expect(isValidDirectory('fail/other', ['main/**/other'])).to.be.false
        expect(isValidDirectory('main/other', ['main/**/other'])).to.be.true
        expect(isValidDirectory('main/other/', ['main/**/other'])).to.be.true
        expect(isValidDirectory('main/1/other', ['main/**/other'])).to.be.true
        expect(isValidDirectory('main/1/2/other', ['main/**/other'])).to.be.true
        expect(isValidDirectory('main/1/2/3/other', ['main/**/other'])).to.be.true
        expect(isValidDirectory('main/1/2/3/other/', ['main/**/other'])).to.be.true
        expect(isValidDirectory('main/1/2/3/other/1', ['main/**/other'])).to.be.false
      })
    })
    describe('more than one GlobStart', () => {
      it('valid only if subdirectories match', () => {
        expect(isValidDirectory('fail/sub', ['deep/**/sub/**'])).to.be.false
        expect(isValidDirectory('deep/fail', ['deep/**/sub/**'])).to.be.false
        expect(isValidDirectory('deep/sub', ['deep/**/sub/**'])).to.be.false
        expect(isValidDirectory('deep/sub/', ['deep/**/sub/**'])).to.be.true
        expect(isValidDirectory('deep/1/sub/1', ['deep/**/sub/**'])).to.be.true
        expect(isValidDirectory('deep/1/sub/1/', ['deep/**/sub/**'])).to.be.true
        expect(isValidDirectory('deep/1/fail/1', ['deep/**/sub/**'])).to.be.false
        expect(isValidDirectory('fail/1/sub/1', ['deep/**/sub/**'])).to.be.false
        expect(isValidDirectory('deep/1/2/3/sub/1/2/3', ['deep/**/sub/**'])).to.be.true
        expect(isValidDirectory('deep/1/2/3/sub/1/2/3/', ['deep/**/sub/**'])).to.be.true
      })
    })
  })
})
