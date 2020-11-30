type Hash = {
  [key: string]: TrieNode;
};

class TrieNode {
  key?: string;
  parent?: TrieNode;
  children: Hash;

  constructor(key?: string) {
    this.key = key;
    this.children = {};
  }
}

class Trie {
  private root: TrieNode;
  constructor() {
    this.root = new TrieNode();
  }

  insert(words: string[]): void {
    let node = this.root;
    for (let i = 0; i < words.length; i++) {
      if (!node.children[words[i]]) {
        node.children[words[i]] = new TrieNode(words[i]);
        node.children[words[i]].parent = node;
      }

      node = node.children[words[i]];
    }
  }

  contains(words: string[]): boolean {
    let node = this.root;
    for (let i = 0; i < words.length; i++) {
      if (node.children[words[i]]) {
        node = node.children[words[i]];
      } else {
        return false;
      }
    }
    return !!node.parent;
  }

  findIndexesFrom(words: string[]): number[] {
    let node = this.root;
    const output: number[] = [];
    let i = 0;
    while (i < words.length) {
      if (node.children[words[i]]) {
        node = node.children[words[i]];
        i++;
      } else {
        if (node.parent) {
          output.push(i - 1);
        }
        if (node === this.root) {
          i++;
        } else {
          node = this.root;
        }
      }
    }

    if (node.parent) {
      output.push(i - 1);
    }
    return output;
  }
}

export default Trie;
