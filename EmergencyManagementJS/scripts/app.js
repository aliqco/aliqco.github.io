// Data class
class Data {
  constructor(id, name, time, priority, description) {
    this.Id = id;
    this.Name = name;
    this.Time = time;
    this.Priority = priority;
    this.Description = description;
  }

  toString() {
    return `[ID: ${this.Id}, Name: ${this.Name}, Time: ${this.Time}, Priority: ${this.Priority}, Description: ${this.Description}]`;
  }
}

// BSTNode Class
class BSTNode {
  constructor(data) {
    this.Data = data;
    this.right = null;
    this.left = null;
  }
}

// BST Class
class BST {
  constructor() {
    this.Root = null;
  }

  static BSTInsert(node, request) {
    if (node === null) return new BSTNode(request);

    if (request.Id < node.Data.Id) node.left = BST.BSTInsert(node.left, request);
    else node.right = BST.BSTInsert(node.right, request);

    return node;
  }

  static Search(node, id) {
    if (node === null || node.Data.Id === id) return node;

    if (id < node.Data.Id) return BST.Search(node.left, id);
    else return BST.Search(node.right, id);
  }

  static Delete(root, id) {
    if (root === null) return null;

    if (id === root.Data.Id) {
      if (root.left === null && root.right === null) {
        return null;
      } else if (root.left === null) {
        return root.right;
      } else if (root.right === null) {
        return root.left;
      } else {
        let successor = root.right;
        while (successor.left !== null) {
          successor = successor.left;
        }
        root.Data = successor.Data;
        root.right = BST.Delete(root.right, successor.Data.Id);
      }
    } else {
      if (id < root.Data.Id) {
        root.left = BST.Delete(root.left, id);
      } else {
        root.right = BST.Delete(root.right, id);
      }
    }
    return root;
  }

  static InOrder(node) {
    if (node === null) return "";

    let left = BST.InOrder(node.left);
    let current = node.Data.toString() + "\n";
    let right = BST.InOrder(node.right);

    return left + current + right;
  }

  static BSTLen(node) {
    if (node === null) return 0;
    return 1 + BST.BSTLen(node.left) + BST.BSTLen(node.right);
  }

  static HighPriorityLen(node) {
    if (node === null) return 0;

    let counter = 0;
    if (node.Data.Priority === 4) {
      counter = 1;
    }
    return (
      counter + BST.HighPriorityLen(node.left) + BST.HighPriorityLen(node.right)
    );
  }
}

// MAX Heap class
class MaxHeap {
  constructor(size = 100) {
    this.heap = new Array(size);
    this.nextIndex = 1;
  }

  heapInsert(priority, id) {
    this.heap[this.nextIndex] = { Priority: priority, Id: id };
    let current = this.nextIndex;
    this.nextIndex++;
    this.adjust2Top(current);
  }

  adjust2Top(current) {
    while (
      current > 1 &&
      this.heap[current].Priority > this.heap[Math.floor(current / 2)].Priority
    ) {
      this.Swap(current, Math.floor(current / 2));
      current = Math.floor(current / 2);
    }
  }

  adjust2Down(current) {
    while (2 * current < this.nextIndex) {
      let left = 2 * current;
      let right = left + 1;
      let largeright = left;

      if (
        right < this.nextIndex &&
        this.heap[right].Priority > this.heap[left].Priority
      ) {
        largeright = right;
      }

      if (this.heap[current].Priority >= this.heap[largeright].Priority) {
        break;
      }

      this.Swap(current, largeright);
      current = largeright;
    }
  }

  DelMax() {
    if (this.nextIndex === 1) throw new Error("Heap is empty.");

    let max = this.heap[1];
    this.Swap(1, this.nextIndex - 1);
    this.nextIndex--;
    this.adjust2Down(1);
    return max;
  }

  FindIndex(id) {
    for (let i = 1; i < this.nextIndex; i++) {
      if (this.heap[i].Id === id) return i;
    }
    return -1;
  }

  RemoveById(id) {
    let wantedIndex = this.FindIndex(id);
    if (wantedIndex === -1) return false;

    this.heap[wantedIndex] = this.heap[this.nextIndex - 1];
    this.nextIndex--;

    if (this.nextIndex <= 1) return true;

    if (
      wantedIndex > 1 &&
      this.heap[wantedIndex].Priority >
        this.heap[Math.floor(wantedIndex / 2)].Priority
    ) {
      this.adjust2Top(wantedIndex);
    } else {
      this.adjust2Down(wantedIndex);
    }

    return true;
  }

  // یه کپی از هیپ اولیه که ساختارش بهم نریزه، از آخر هیپ با خونه اول جابحا میکنیم، بعد ساختار رو درست میکنیم
  HeapSort() {
    const heapCopy = [...this.heap];    
    const heapIndexCopy = this.nextIndex;
    let sorted = [];
    let size = this.nextIndex - 1;
    for (let i = size; i > 1; i--) {
      this.Swap(1, i);
      this.nextIndex--;
      this.adjust2Down(1);
    }
    sorted = this.heap.slice(1, size + 1);
    this.heap = heapCopy;
    this.nextIndex = heapIndexCopy;

    return sorted.reverse();
  }

  GetPriority(id) {
    let index = this.FindIndex(id);
    if (index !== -1) {
      return this.heap[index].Priority;
    } else {
      return -1;
    }
  }

  Swap(i, j) {
    let temp = this.heap[i];
    this.heap[i] = this.heap[j];
    this.heap[j] = temp;
  }

  IsEmpty() {
    return this.nextIndex === 1;
  }

  PrintHeap() {
    let result = "";
    for (let i = 1; i <= this.nextIndex - 1; i++) {
      result += `[${i} => Priority: ${this.heap[i].Priority}, ID: ${this.heap[i].Id}]\n`;
    }
    return result;
  }
}

// Main class
class EmergencySystem {
  constructor() {
    this.bst = new BST();
    this.heap = new MaxHeap(100);
  }

  AddRequest(name, time, priority, description) {
    let id = Math.floor(Date.now() % (Math.random() * 10000));
    console.log(BST.Search(this.bst.Root, id));
    while (BST.Search(this.bst.Root, id === null)) {
      id = Math.floor(Date.now() % (Math.random() * 10000));
    }

    let request = new Data(id, name, time, priority, description);
    this.bst.Root = BST.BSTInsert(this.bst.Root, request);
    this.heap.heapInsert(priority, id);

    return `A request with ID: ${id} added succesfully.`;
  }

  SearchRequest(id) {
    let foundNode = BST.Search(this.bst.Root, id);
    if (foundNode !== null) {
      return foundNode;
    }
  }

  HandleHighPriorityRequest() {
    if (this.heap.IsEmpty()) addLog("Heap is empty!", "text-red-400");

    let max = this.heap.DelMax();
    let foundNode = BST.Search(this.bst.Root, max.Id);

    if (foundNode !== null) {
      let bstPriority = foundNode.Data.Priority;
      if (bstPriority === max.Priority) {
        this.bst.Root = BST.Delete(this.bst.Root, max.Id);
        return `Request by ID ${max.Id} with Priority ${max.Priority} handled successfully.`;
      }
    }
  }

  UpdatePriority(requestId, newPriority) {
    let foundNode = BST.Search(this.bst.Root, requestId);
    if (foundNode === null && this.heap.FindIndex(requestId) === -1) {
      addLog(`Request with ID ${requestId} not found.`, 'text-red-400');
    }

    let oldPriority = foundNode.Data.Priority;
    foundNode.Data.Priority = newPriority;
    this.heap.RemoveById(requestId);
    this.heap.heapInsert(newPriority, requestId);

    addLog(`Priority of ID: ${requestId} successfully changed to ${newPriority} from ${oldPriority} priority.`);
  }

  PrintInOrderOfBST() {
    let result = BST.InOrder(this.bst.Root);
    return result.trim() !== ""
      ? result.trim()
      : "There is no request in BST for inOrder print.";
  }

  PrintHeap() {
    const result = this.heap.PrintHeap();
    return result && result.trim() !== "" 
        ? result.trim() 
        : "Heap is empty.";
    }

  TotalRequests() {
    return BST.BSTLen(this.bst.Root);
  }

  HighPriorityRequests() {
    return BST.HighPriorityLen(this.bst.Root);  
  }

  deleteRequest(id) {
    let heapDelete = this.heap.RemoveById(id);
    let bstDelete = BST.Search(this.bst.Root, id);
    let bstDeleted = false;

    if (bstDelete !== null) {
      this.bst.Root = BST.Delete(this.bst.Root, id);
      bstDeleted = true;
    }

    if (heapDelete && bstDeleted) {
      renderBST();
      return true;
    } else {
      
      return false;
    }
  }

  // d3 js for drawing tree
  ConvertToD3(node) {
    if (!node) return null;

    let d3 = {
      id: `${node.Data.Id}`,
      priority: `${node.Data.Priority}`,
      children: [],
    };

    if (node.left) d3.children.push(this.ConvertToD3(node.left));
    if (node.right) d3.children.push(this.ConvertToD3(node.right));

    if (d3.children.length === 0) delete d3.children;
    return d3;
  }
}

const emergencySystem = new EmergencySystem();

// Event handlder
function handleAddRequest() {
  const name = document.querySelector(".request-name-input").value;
  const priority = parseInt(document.querySelector(".select-input").value);
  const description = document.querySelector(".request-desc-textarea").value;

  if (!name || !priority || !description) {
    addLog("All fields are required!", "text-red-400");
    return;
  }

  if (priority == -1) {
    addLog("Select a correct priority!", "text-red-400");
    return;
  }

  const result = emergencySystem.AddRequest(
    name,
    new Date(),
    priority,
    description
  );
  addLog(result);
  renderBST();

  document.querySelector(".request-name-input").value = "";
  document.querySelector(".select-input").value = "-1";
  document.querySelector(".request-desc-textarea").value = "";
  updateRequestsNumber();
}

function handleUpdatePriority() {
  const requestId = parseInt(
    document.querySelector(".update-request-id-input").value
  );
  const newPriority = parseInt(
    document.querySelector(".select-update-input").value
  );

  if (!requestId || !newPriority) {
    addLog("ID and new priority are required!", "text-red-400");
    return;
  }

  if (newPriority == -1) {
    addLog("Select correct priority!", "text-red-400");
    return;
  }

  const result = emergencySystem.UpdatePriority(requestId, newPriority);
  addLog("---------------------------------------------------");

  document.querySelector(".update-request-id-input").value = "";
  document.querySelector(".select-update-input").value = "-1";

  renderBST();
}

function handleSearchRequest() {
  const searchId = parseInt(
    document.querySelector(".search-request-id-input").value
  );

  if (!searchId) {
    addLog("ID is required!", "text-red-400");
    return;
  }

  const result = emergencySystem.SearchRequest(searchId);
  result
    ? addLog(`
                A request with ${searchId} ID: 
                Name: ${result.Data.Name},
                Priority: ${result.Data.Priority},
                Time: ${result.Data.Time},
                Description: ${result.Data.Description}
            `)
    : addLog(`There is no request with ${searchId} id!`, "text-red-400");
  addLog("---------------------------------------------------");
  document.querySelector(".search-request-id-input").value = "";
}

function handleDeleteRequest() {
  const delId = parseInt(document.querySelector(".del-request-id-input").value);
  if (!delId) {
    addLog("ID is required!", "text-red-400");
    return;
  }
  let result = emergencySystem.deleteRequest(delId);

  result ?
    addLog(`Request with ID: ${delId} deleted successfully from BST and Heap.`) : 
    addLog(`Request with ID ${delId} not found in BST or Heap.`, 'text-red-400');
  document.querySelector(".del-request-id-input").value = "";
  updateRequestsNumber();
}

function handleHighPriorityRequest() {
  const result = emergencySystem.HandleHighPriorityRequest();
  addLog(result);
  addLog("---------------------------------------------------");
  renderBST();
  updateRequestsNumber();
}

function handlePrintInorderBST() {
  const result = emergencySystem.PrintInOrderOfBST();
  addLog(
    "-------------- Inorder print of bst ---------------",
    "text-purple-500"
  );
  result.split("\n").forEach((node) => {
    if (node.trim() !== "") addLog(node, "text-white");
  });
}

function handlePrintInorderHeap() {
  addLog("-------------- Heap ---------------", "text-indigo-500 ");
  const result = emergencySystem.PrintHeap();
  result.split("\n").forEach((heap) => {
    if (heap.trim() !== "") addLog(heap, "text-white");
  });
}

function handleHeapSortPrint() {
  addLog("-------------- HeapSort ---------------", "text-blue-600 ");
  let sortedHeap = emergencySystem.heap.HeapSort();
  sortedHeap.forEach((item) => {
    addLog(`ID: ${item.Id}, Priority: ${item.Priority}`, "text-white");
  });
}

function handleClearLog() {
  document.querySelector(".log").textContent = "";
}

function handleClearInputs() {
  document.querySelector(".request-name-input").value = "";
  document.querySelector(".select-input").value = "-1";
  document.querySelector(".request-desc-textarea").value = "";
}

function handleClearNodes() {
  if (confirm("Are you sure to clear all requests?")) {
    emergencySystem.bst.Root = null;
    emergencySystem.heap = new MaxHeap(100);
    document.querySelector(".BST-Tree").innerHTML = "";
    renderBST();
    updateRequestsNumber();
  }
}

// BST Draw methods
function drawTree(BSTNodeData) {
  const container = document.querySelector(".BST-Tree");
  container.innerHTML = "";
  console.log(BSTNodeData);
  const width = 800;
  const height = 600;

  const svg = d3
    .select(".BST-Tree")
    .append("svg")
    .attr("width", width)
    .attr("height", height)
    .append("g")
    .attr("transform", "translate(40,40)");

  const root = d3.hierarchy(BSTNodeData);
  const treeLayout = d3.tree().size([width - 100, height - 100]);
  treeLayout(root);

  // Draw links
  svg
    .selectAll(".link")
    .data(root.links())
    .enter()
    .append("path")
    .attr("class", "link")
    .attr(
      "d",
      d3
        .linkVertical()
        .x((d) => d.x)
        .y((d) => d.y)
    );

  // Draw nodes
  const node = svg
    .selectAll(".node")
    .data(root.descendants())
    .enter()
    .append("g")
    .attr("class", "node")
    .attr("transform", (d) => `translate(${d.x},${d.y})`)
    .on("click", function (event, d) {
      let result = emergencySystem.SearchRequest(parseInt(d.data.id));
      addLog(
        `clicked on node with ${result.Data.Id}:
                Name: ${result.Data.Name},
                Priority: ${result.Data.Priority},
                Time: ${result.Data.Time},
                Description: ${result.Data.Description}
                `,
        "text-white",
        "xl"
      );
    });

  node
    .append("circle")
    .attr("r", 30)
    .style("fill", (d) => {
      const priority = d.data.priority;
      if (priority == 4) return "oklch(44.4% 0.177 26.899)";
      if (priority == 3) return "oklch(64.6% 0.222 41.116)";
      if (priority == 2) return "oklch(68.1% 0.162 75.834)";
      return "oklch(62.7% 0.194 149.214)";
    });

  node
    .append("text")
    .attr("dy", -3)
    .style("font-size", "14px")
    .attr("text-anchor", "middle")
    .text((d) => d.data.id);

  node
    .append("text")
    .attr("dy", 12)
    .attr("text-anchor", "middle")
    .style("font-size", "12px")
    .style("fill", "white")
    .text((d) => `P: ${d.data.priority}`);
}

function renderBST() {
  const container = document.querySelector(".BST-Tree");
  container.innerHTML = "";
  const BSTNodeData = emergencySystem.ConvertToD3(emergencySystem.bst.Root);
  if (BSTNodeData) drawTree(BSTNodeData);
}

// log mananger
function addLog(message, color = "text-green-400", fontSize = "sm") {
  const log = document.querySelector(".log");
  const logContent = document.createElement("p");
  logContent.textContent = message;
  logContent.className = `${color} text-${fontSize}`;
  log.appendChild(logContent);
}

// total req and total high
function updateRequestsNumber() {
  const totalReq = emergencySystem.TotalRequests();
  const totalHigh = emergencySystem.HighPriorityRequests();
  document.querySelector(".total-req").innerHTML = totalReq;
  document.querySelector(".high-req").innerHTML = totalHigh;
}
// Test data
function AddDefaultRequests() {
  let currentDate = new Date();
  const defaultRequests = [
    {
      name: "Ali",
      time: currentDate,
      priority: 3,
      description: "Heart attack",
    },
    { name: "Hassan", time: currentDate, priority: 2, description: "Burn" },
    {
      name: "Jafar",
      time: currentDate,
      priority: 4,
      description: "Heart attack",
    },
    { name: "Yoones", time: currentDate, priority: 4, description: "Ear pain" },
    { name: "Karim", time: currentDate, priority: 1, description: "Accident" },
    {
      name: "Morteza",
      time: currentDate,
      priority: 1,
      description: "Accident",
    },
    { name: "Hakim", time: currentDate, priority: 4, description: "Accident" },
    { name: "Sadegh", time: currentDate, priority: 2, description: "Virus" },
    { name: "Ehsan", time: currentDate, priority: 3, description: "Accident" },
  ];

  defaultRequests.forEach((req) => {
    const result = emergencySystem.AddRequest(
      req.name,
      req.time,
      req.priority,
      req.description
    );
    addLog(result);
  });

  renderBST();
}
window.addEventListener("load", function () {
  AddDefaultRequests();
  updateRequestsNumber();
});
