import { ICoord } from "../util/ds";
import { addSelection } from "./kfTree";
import { MarkSelector } from "./markSelector";
import "../assets/style/suggestBox.scss";
import Tool from "../util/tool";
export class SuggestPanel {
  static PADDING: number = 6;
  static SHOWN_NUM: number = 2;
  static MENU_WIDTH: number = 20;

  public kfWidth: number = 240;
  public kfHeight: number = 178;
  public boxWidth: number = 240;
  public menuWidth: number = 0;
  public preMenuWidth: number = 0;
  public numShown: number = SuggestPanel.SHOWN_NUM;
  public container: SVGElement;
  public itemcontainer: SVGElement;
  public suggestMenu: SuggestMenu;
  public selectedMarks: string[] = [];
  /**
   * createSuggestPanel
   */
  public createSuggestPanel(allNextKf: string[][], height: number, selectedMarks: string[]) {
    this.kfHeight = height;
    this.selectedMarks = selectedMarks;
    if (typeof this.container === "undefined") {
      this.container = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "g"
      );
    }

    if (allNextKf.length <= 0) {
      this.numShown = allNextKf.length;
      if (typeof this.suggestMenu !== "undefined") {
        // this.container.removeChild(this.suggestMenu.container);
        this.container.innerHTML = '';
        this.suggestMenu = undefined;
      }
    } else {
      this.numShown = SuggestPanel.SHOWN_NUM;
      this.suggestMenu = new SuggestMenu();
      this.suggestMenu.createSuggestMenu(
        { x: this.boxWidth, y: height / 2 + SuggestPanel.PADDING },
        allNextKf,
        this
      );
      this.container.appendChild(this.suggestMenu.container);
    }
    const bg: SVGRectElement = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "rect"
    );
    bg.setAttributeNS(null, "width", `${this.boxWidth}`);
    bg.setAttributeNS(null, "height", `${(height + SuggestPanel.PADDING) * 2}`);
    bg.setAttributeNS(null, "fill", "#c9caca");
    bg.setAttributeNS(null, "stroke", "#676767");
    bg.setAttributeNS(null, "rx", "5");
    this.container.appendChild(bg);

    this.itemcontainer = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "g"
    );
    this.container.appendChild(this.itemcontainer);
    for (let i = 0; i < this.numShown; i++) {
      const item = this.createSuggestItem(allNextKf[i]);
      item.setAttributeNS(
        null,
        "transform",
        `translate(0, ${i * (height + 2 * SuggestPanel.PADDING)})`
      );
      this.itemcontainer.appendChild(item);
    }

    const popupLayer: SVGElement = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "g"
    );
    popupLayer.setAttributeNS(null, "id", "popUpLayer");
    if (allNextKf.length > 0) {
      popupLayer.appendChild(this.container);
    }

    return popupLayer;
  }
  public removeSuggestPanel() {
    if (typeof this.container !== "undefined") {
      this.container.innerHTML = "";
    }
    const popupLayer = document.getElementById("popUpLayer");
    if (popupLayer) {
      popupLayer.removeChild(this.container);
    }
  }
  public createSuggestItem(nextKf: string[]) {
    const container = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "g"
    );
    container.classList.add("clickable-component");
    //TODO: create kf item
    const itemImg = new Itemimg();
    const img = itemImg.createItemimg(nextKf, this.selectedMarks);
    const bg: SVGRectElement = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "rect"
    );
    bg.classList.add("ease-fade", "hide-ele");
    bg.setAttributeNS(null, "width", `${this.kfWidth}`);
    bg.setAttributeNS(null, "height", `${this.kfHeight}`);
    bg.setAttributeNS(null, "fill", "#b6b6b6");
    bg.setAttributeNS(null, "rx", "5");
    container.appendChild(bg);
    container.appendChild(itemImg.container);
    container.onmouseover = () => {
      bg.classList.remove("hide-ele");
    };
    container.onmouseout = () => {
      bg.classList.add("hide-ele");
    };
    container.onclick = () => {
      setTimeout(() => {
        addSelection(nextKf);
      }, 1);
    };
    return container;
  }
}
export class SuggestMenu {
  static MENU_WIDTH: number = 20;
  static MENU_RX: number = 5;
  static MENU_ICON_COLOR: string = "#e5e5e5";
  static MENU_ICON_HIGHLIGHT_COLOR: string = "#494949";
  static BTN_SIZE: number = 20;
  static PADDING: number = 2;
  static DOT_SIZE: number = 10;
  static UP_DIRECT: string = "up";
  static DOWN_DIRECT: string = "down";

  public container: SVGGElement;
  public parentSuggestPanel: SuggestPanel;
  public numPages: number = 0;
  public pageIdx: number = 0;
  public dots: SVGCircleElement[] = [];
  public nextKf: string[][] = [];
  public createSuggestMenu(
    startCoord: ICoord,
    nextKf: string[][],
    SuggestPanel: SuggestPanel
  ) {
    this.parentSuggestPanel = SuggestPanel;
    this.nextKf = nextKf;
    this.numPages = Math.ceil(nextKf.length / 2);
    const menuHeight: number =
      (SuggestMenu.BTN_SIZE + 2 * SuggestMenu.PADDING) * 2 +
      this.numPages * (SuggestMenu.DOT_SIZE + 2 * SuggestMenu.PADDING);
    this.container = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "g"
    );
    this.container.setAttributeNS(
      null,
      "transform",
      `translate(${startCoord.x - SuggestMenu.MENU_RX}, ${startCoord.y - menuHeight / 2
      })`
    );
    const bg: SVGRectElement = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "rect"
    );
    bg.setAttributeNS(
      null,
      "width",
      `${SuggestMenu.MENU_RX + SuggestMenu.MENU_WIDTH}`
    );
    bg.setAttributeNS(null, "height", `${menuHeight}`);
    bg.setAttributeNS(null, "fill", "#676767");
    bg.setAttributeNS(null, "rx", `${SuggestMenu.MENU_RX}`);
    this.container.appendChild(bg);

    const upArrow: SVGPolygonElement = this.createArrowBtn(
      SuggestMenu.UP_DIRECT,
      menuHeight
    );
    this.container.appendChild(upArrow);
    const downArrow: SVGPolygonElement = this.createArrowBtn(
      SuggestMenu.DOWN_DIRECT,
      menuHeight
    );
    this.container.appendChild(downArrow);

    this.dots = [];
    for (let i = 0; i < this.numPages; i++) {
      const tmpDot: SVGCircleElement = this.createDot(i);
      this.container.appendChild(tmpDot);
      this.dots.push(tmpDot);
    }
  }

  public createArrowBtn(direct: string, menuHeight: number): SVGPolygonElement {
    let arrow: SVGPolygonElement = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "polygon"
    );
    // arrow.setAttributeNS(null, 'fill', SuggestMenu.MENU_ICON_COLOR);
    arrow.classList.add("clickable-component", "normal-btn");
    switch (direct) {
      case SuggestMenu.UP_DIRECT:
        arrow.setAttributeNS(
          null,
          "points",
          "9.76,2.41 16.46,17.59 9.76,14.68 3.12,17.59"
        );
        arrow.setAttributeNS(
          null,
          "transform",
          `translate(${SuggestMenu.MENU_RX}, ${SuggestMenu.PADDING})`
        );
        arrow.onclick = () => {
          if (this.pageIdx > 0) {
            this.pageIdx--;
            this.arrowClickListener();
          }
        };
        break;
      case SuggestMenu.DOWN_DIRECT:
        arrow.setAttributeNS(
          null,
          "points",
          "3.12,2.41 9.76,5.32 16.46,2.41 9.76,17.59"
        );
        arrow.setAttributeNS(
          null,
          "transform",
          `translate(${SuggestMenu.MENU_RX}, ${menuHeight - SuggestMenu.BTN_SIZE - SuggestMenu.PADDING
          })`
        );
        arrow.onclick = () => {
          if (this.pageIdx < this.numPages - 1) {
            this.pageIdx++;
            this.arrowClickListener();
          }
        };
        break;
    }
    return arrow;
  }

  public arrowClickListener() {
    this.parentSuggestPanel.itemcontainer.innerHTML = "";
    for (let i = this.pageIdx * 2; i < (this.pageIdx + 1) * 2; i++) {
      if (i < this.nextKf.length) {
        const index: number = i % 2;
        const item = this.parentSuggestPanel.createSuggestItem(this.nextKf[i]);
        item.setAttributeNS(
          null,
          "transform",
          `translate(0, ${index *
          (this.parentSuggestPanel.kfHeight + 2 * SuggestPanel.PADDING)
          })`
        );
        this.parentSuggestPanel.itemcontainer.appendChild(item);
      }
    }
    this.dots.forEach((dot: SVGCircleElement, idx: number) => {
      if (idx === this.pageIdx) {
        dot.classList.add("highlight-btn");
      } else {
        dot.classList.remove("highlight-btn");
      }
    });
  }

  public createDot(idx: number): SVGCircleElement {
    let dot: SVGCircleElement = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "circle"
    );
    dot.classList.add("clickable-component", "normal-btn");
    if (idx === 0) {
      dot.classList.add("clickable-component", "highlight-btn");
    }
    dot.setAttributeNS(null, "fill", SuggestMenu.MENU_ICON_COLOR);
    dot.setAttributeNS(null, "r", `${SuggestMenu.BTN_SIZE / 2 - 6}`);
    dot.setAttributeNS(
      null,
      "cx",
      `${SuggestMenu.MENU_RX + SuggestMenu.BTN_SIZE / 2}`
    );
    dot.setAttributeNS(
      null,
      "cy",
      `${SuggestMenu.BTN_SIZE +
      SuggestMenu.PADDING * 3 +
      SuggestMenu.DOT_SIZE / 2 +
      (SuggestMenu.DOT_SIZE + 2 * SuggestMenu.PADDING) * idx
      }`
    );
    dot.onclick = () => {
      this.pageIdx = idx;
      this.arrowClickListener();
    };
    return dot;
  }
}
export class Itemimg {
  static KF_WIDTH: number = 220;
  public container: SVGElement;
  public createItemimg(nextKf: string[], selectedMarks: string[]) {
    this.container = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "g"
    );
    const bg = this.drawItemBg(
      suggestPanel.kfHeight - 2 * SuggestPanel.PADDING
    );
    bg.setAttributeNS(
      null,
      "transform",
      `translate(5, ${SuggestPanel.PADDING})`
    );
    const thumbnail = this.drawItemContent(nextKf, selectedMarks, suggestPanel.kfHeight - 2 * SuggestPanel.PADDING);
    this.container.appendChild(bg);
    this.container.appendChild(thumbnail);
  }
  public drawItemBg(height: number) {
    const bg: SVGRectElement = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "rect"
    );
    bg.setAttributeNS(null, "width", `${Itemimg.KF_WIDTH}`);
    bg.setAttributeNS(null, "height", `${height}`);
    bg.setAttributeNS(null, "fill", "#fff");
    return bg;
  }
  public drawItemContent(nextKf: string[], selectedMarks: string[], height: number) {
    const svg = document.getElementById("visChart");
    //深度拷贝svg
    const svgClone = svg.cloneNode(true) as HTMLElement;
    //将svg的宽高设置为canvas的宽高
    svgClone.setAttributeNS(null, "width", `${Itemimg.KF_WIDTH}`);
    svgClone.setAttributeNS(null, "height", `${height}`);
    //将svg的所有mark的opacity设置为0
    Array.from(svgClone.getElementsByClassName("mark")).forEach(
      (mark: SVGElement) => {
        if (nextKf.includes(mark.id)) {
          mark.setAttributeNS(null, "opacity", "1");
        } else if (selectedMarks.includes(mark.id)) {
          mark.setAttributeNS(null, "opacity", "0.3");
        } else {
          mark.setAttributeNS(null, "display", "none");
        }
      }
    );
    Array.from(svgClone.getElementsByTagName("*")).forEach(
      (element: SVGElement) => {
        if (element.id.startsWith("__mark")) {
          element.setAttributeNS(null, "display", "none");
        }
      }
    );
    const imgSrc: string = Tool.svg2url(svgClone);
    const chartThumbnail: SVGImageElement = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "image"
    );
    chartThumbnail.setAttributeNS(null, "href", imgSrc);
    chartThumbnail.setAttributeNS(null, "width", `${Itemimg.KF_WIDTH}`);
    chartThumbnail.setAttributeNS(null, "height", `${height}`);
    return chartThumbnail;
  }
}
export const suggestPanel = new SuggestPanel();