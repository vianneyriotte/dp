/*** VISITOR Pattern ***/

interface IVisitor {
  visitFile(element: FFile): void;
  visitFolder(element: Folder): void;
  visitLink(element: Link): void;
}

abstract class FSElement {
  date: Date;
  name: string;
  size: number = 1;

  constructor(name: string) {
    this.date = new Date();
    this.name = name;
  }

  abstract accept(visitor: IVisitor): void;
}

abstract class Linkable extends FSElement {
  constructor(name: string) {
    super(name);
  }
}

class Folder extends Linkable {
  children: FSElement[] = [];

  constructor(name: string) {
    super(name);
  }

  accept(visitor: IVisitor) {
    visitor.visitFolder(this);
  }

  addElement(element: FSElement) {
    this.children.push(element);
    this.size += element.size;
  }
}

class FFile extends Linkable {
  size: number;
  constructor(name: string, size: number) {
    super(name);
    this.size = size;
  }

  accept(visitor: IVisitor) {
    visitor.visitFile(this);
  }
}

class Link extends FSElement {
  target: Linkable;
  constructor(name: string, target: Linkable) {
    super(name);
    this.target = target;
  }

  accept(visitor: IVisitor) {
    visitor.visitLink(this);
  }
}

class Affichage implements IVisitor {
  level: number;

  constructor(element: FSElement) {
    this.level = 1;
    element.accept(this);
  }

  visitFile(element: FFile): void {
    console.log(
      `${Array(this.level).join("   ")} |_ ${element.name} (${element.size})`
    );
  }

  visitLink(element: Link): void {
    console.log(
      `${Array(this.level).join("   ")} |_ ${element.name} -> ${
        element.target.name
      }`
    );
  }

  visitFolder(element: Folder): void {
    console.log(`${Array(this.level).join("   ")} |_ DIR ${element.name}`);
    this.level++;
    for (const el of element.children) {
      el.accept(this);
    }
  }
}

const root = new Folder("/");
const ff = new FFile("fichier1.txt", 23);
root.addElement(ff);
const dir2 = new Folder("tmp");
dir2.addElement(new FFile("fichier2.txt", 3));
dir2.addElement(new Link("lien_dir1", dir2));
dir2.addElement(new Link("lien_file2", ff));
root.addElement(dir2);

const affichage = new Affichage(root);
