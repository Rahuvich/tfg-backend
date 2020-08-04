class PaginationService {
  constructor() {}

  hasNextPage(allEdges, before, after, first, last) {
    if (first) {
      const edges = this.applyCursorsToEdges(allEdges, before, after);
      return edges.length > first;
    }

    if (before) {
      // TODO If the server can efficiently determine that elements exist following before, return true.
    }

    return false;
  }

  hasPreviousPage(allEdges, before, after, first, last) {
    if (last) {
      const edges = this.applyCursorsToEdges(allEdges, before, after);
      return edges.length > last;
    }

    if (after) {
      const afterEdge = allEdges.findIndex((edge) => edge.cursor === after);
      if (afterEdge >= 0) {
        return true;
      }
    }
    return false;
  }

  applyCursorsToEdges(allEdges, before, after) {
    const edges = allEdges.slice();

    if (after) {
      const afterEdge = edges.findIndex((edge) => edge.cursor === after);
      if (afterEdge >= 0) {
        edges.splice(0, afterEdge + 1);
      }
    }

    if (before) {
      const beforeEdge = edges.findIndex((edge) => (edge.cursor = before));
      if (beforeEdge >= 0) {
        edges.splice(beforeEdge - 1, edges.length); // ! Maybe should do edges.length + 1
      }
    }
    return edges;
  }

  edgesToReturn(allEdges, before, after, first, last) {
    const edges = this.applyCursorsToEdges(allEdges, before, after);

    if (first) {
      if (first < 0) throw new Error("First must be positive integer");
      if (edges.length > first) {
        edges.splice(first, edges.length);
      }
    }

    if (last) {
      if (last < 0) throw new Error("Last must be positive integer");
      if (edges.length > last) {
        edges.splice(0, last);
      }
    }
    return edges;
  }
}

export default new PaginationService();
