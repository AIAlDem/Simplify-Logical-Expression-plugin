/**
 * @typedef {object} curIndex
 * @property {number} Index Индекс следующей компоненты для обработки
 */

/**
 * Узел дерева логического выражения
 * 
 * Типы узлов:
 * operand - неделимый операнд
 * constant - логическая константа
 * not - логическое отрицание
 * and - логическое И
 * or - логическое ИЛИ
 * 
 * @typedef {Object} Node
 * @property {'operand' | 'constant' | 'not' | 'and' | 'or'} type - Тип узла
 * @property {string | boolean} [value] - Значение операнда или константы
 * @property {Node} [child] - Дочерний узел логического отрицания
 * @property {Node} [left] - Левый дочерний узел
 * @property {Node} [right] - Правый дочерний узел
 */

/**
 * Результаты разбора выражения
 * 
 * @typedef {object} ParseResult
 * @property {boolean} ok Показатель успешного/неуспешного разбора
 * @property {Node} [node] Новый узел при успешном разборе
 */

/**
 * Разбивает исходное выражение на простейшие компоненты
 * 
 * Логические операторы и скобки выделяются отдельно
 * Сравнения и другие операнды выделяются отдельно
 *  
 * @param {string} expression Выделенное пользователем выражение
 * @returns {string[]} Массив компонент
 */
function splitting(expression) {

    const parts = [];
    let i = 0;

    while(i < expression.length) {

        if(expression[i] == ' ' || expression[i] == '\t' || expression[i] == '\n' || expression[i] == '\r') {
            i++;
            continue;
        }

        if(expression.startsWith('&&', i)) {
            parts.push('&&');
            i += 2;
            continue;
        }

        if(expression.startsWith('||', i)) {
            parts.push('||');
            i += 2;
            continue;
        }

        if(expression[i] == '(' || expression[i] == ')') {
            parts.push(expression[i]);
            i += 1;
            continue;
        }

        if(expression[i] == '!' && ((i + 1 == expression.length) || expression[i + 1] != '=')) {
            parts.push(expression[i]);
            i += 1;
            continue;
        }

        const start = i;
        
        while(i < expression.length) {
            if (
                expression.startsWith("&&", i) ||
                expression.startsWith("||", i) ||
                expression[i] == '(' ||
                expression[i] == ')' ||
                (expression[i] == '!' && (i + 1 >= expression.length || expression[i + 1] != '='))
            ) {
                break;
            }

            i++;
        }

        const operand = expression.slice(start, i).trim();
        parts.push(operand);
    }

    return parts;
}

/**
 * Запускает синтаксический разбор выражения и проверяет, что все составляющие части обработаны
 * 
 * @param {string} expression Выделенное пользователем выражение
 * @returns {ParseResult} результат разбора
 */
function parseExpression(expression) {
    const parts = splitting(expression);
    const curIndex = { Index: 0 };

    const result = parseOr(parts, curIndex);
    
    if(!result.ok) {
        return result
    }

    if(curIndex.Index != parts.length) {
        return {
            ok: false
        }
    }

    return result;
}

/**
 * Разбирает первый приоритет: операнды и константы или выражения в скобках
 * 
 * @param {string[]} parts Массив компонент
 * @param {curIndex} curIndex Текущий индекс парсинга
 * @returns {ParseResult} Результат парсинга элемента
 */
function parsePrimary(parts, curIndex) {
    if (curIndex.Index >= parts.length) {
        return {
            ok: false
        };
    }

    const part = parts[curIndex.Index];

    if(part == '(') {
        curIndex.Index++;

        const result = parseOr(parts, curIndex);

        if(!result.ok) {
            return result;
        }

        if(curIndex.Index >= parts.length || parts[curIndex.Index] != ')') {
            return {
                ok: false
            };
        }

        curIndex.Index++;

        return result;
    }

    if([')', '&&', '||', '!'].includes(part)) {
        return {
            ok: false
        };
    }

    curIndex.Index++;

    if(part == 'true' || part == 'false') {
        return {
            ok: true,
            node: {
                type: 'constant',
                value: part == 'true' ? true : false
            }
        };
    }

    return {
        ok: true,
        node: {
            type: 'operand',
            value: part
        }
    };
}

/**
 * Разбирает унарное логическое выражение
 * 
 * @param {string[]} parts Массив компонент
 * @param {curIndex} curIndex Текущий индекс парсинга
 * @returns {ParseResult} Результат парсинга
 */
function parseUnary(parts, curIndex) {
    if (curIndex.Index < parts.length && parts[curIndex.Index] == '!') {
        curIndex.Index++;

        const result = parseUnary(parts, curIndex);

        if(!result.ok) {
            return result;
        }

        return {
            ok: true,
            node: {
                type: 'not',
                child: result.node
            }
        };
    }



    return parsePrimary(parts, curIndex);
}

/**
 * Разбирает логическое выражение из последовательности операций логического И
 * 
 * @param {string[]} parts Массив компонент
 * @param {curIndex} curIndex Текущий индекс парсинга
 * @returns {ParseResult} Результат парсинга
 */
function parseAnd(parts, curIndex) {
    let result = parseUnary(parts, curIndex);

    if(!result.ok) {
        return result;
    }

    let node = result.node;

    while(curIndex.Index < parts.length && parts[curIndex.Index] == '&&') {
        curIndex.Index++;

        result = parseUnary(parts, curIndex);

        if(!result.ok) {
            return result;
        }

        node = {
            type: 'and',
            left: node,
            right: result.node
        };
    }

    return {
        ok: true,
        node: node
    };
}

/**
 * Разбирает логическое выражение из последовательности операций логического ИЛИ
 * 
 * @param {string[]} parts Массив компонент
 * @param {curIndex} curIndex Текущий индекс парсинга
 * @returns {ParseResult} Результат парсинга
 */
function parseOr(parts, curIndex) {
    let result = parseAnd(parts, curIndex);

    if (!result.ok) {
        return result;
    }

    let node = result.node;

    while(curIndex.Index < parts.length && parts[curIndex.Index] == '||') {
        curIndex.Index++;

        result = parseAnd(parts, curIndex);
        if(!result.ok) {
            return result;
        }

        node = {
            type: 'or',
            left: node,
            right: result.node
        };
    }

    return {
        ok: true,
        node: node
    };
}

/**
 * Проверяет равенство двух узлов дерева
 * 
 * @param {Node} a Первый узел дерева
 * @param {Node} b Второй узел дерева
 * @returns {boolean} Результат проверки равенства узлов
 */
function isEqual(a, b) {

    if(a.type != b.type) {
        return false;
    }

    switch (a.type) {
        case 'operand':
            return a.value == b.value;

        case 'constant':
            return a.value == b.value;

        case 'not':
            return isEqual(a.child, b.child);
        
        case 'and':
        case 'or':
            return isEqual(a.left, b.left) && isEqual(a.right, b.right);

        default:
            return false;
    }

}

/**
 * Проверяет является ли один узел отрицанием другого
 * 
 * @param {Node} a Первый узел дерева
 * @param {Node} b Второй узел дерева
 * @returns {boolean} Результат проверки: true, если узлы представляют a и !a
 */
function isNegativeOf(a, b) {
    return (
        (a.type == 'not' && isEqual(a.child, b)) ||
        (b.type == 'not' && isEqual(a, b.child))
    );
}

/**
 * Упрощает дерево с помощью законов булевой алгебры: нейтральный элемент,
 * поглощение константой, двойное отрицание, идемпотентность, противоречие,
 * исключенное третье, законы де Моргана, законы поглощения.
 * 
 * @param {Node} node Корень обрабатываемого поддерева
 * @returns {Node} Упрощённое поддерево
 */
function simplifyNode(node) {
    if(node.type == 'operand' || node.type == 'constant') {
        return node;
    }

    if(node.type == 'not') {
        const child = simplifyNode(node.child);

        if(child.type == 'constant') {
            return {
                type: 'constant',
                value: !child.value
            };
        }

        if(child.type == 'not') {
            return simplifyNode(child.child);
        }

        if(child.type == 'and' || child.type == 'or') {
            const type = child.type == 'and' ? 'or' : 'and';

            return simplifyNode({
                type: type,
                left: {
                    type: 'not',
                    child: child.left
                },
                right: {
                    type: 'not',
                    child: child.right
                }
            });
        }

        return {
            type: 'not',
            child: child
        };
    }

    const left = simplifyNode(node.left);
    const right = simplifyNode(node.right);

    if(node.type == 'and') {
        if(left.type == 'constant') {
            return left.value == true ? right : left;
        }

        if(right.type == 'constant') {
            return right.value == true ? left : right;
        }

        if(isEqual(left, right)){
            return left;
        }

        if(isNegativeOf(left, right)) {
            return {
                type: 'constant',
                value: false
            };
        }

        if(right.type == 'or' && (isEqual(left, right.left) ||
                                  isEqual(left, right.right))) {
            return left;
        }

        if(left.type == 'or' && (isEqual(left.left, right) || 
                                 isEqual(left.right, right))) {
            return right;
        }
    }

    if (node.type == 'or') {
        if(left.type == 'constant') {
            return left.value == true ? left : right;
        }

        if (right.type == 'constant') {
            return right.value == true ? right : left;
        }

        if (isEqual(left, right)) {
            return left;
        }

        if (isNegativeOf(left, right)) {
            return {
                type: 'constant',
                value: true
            };
        }

        if(right.type == 'and' && (isEqual(left, right.left) ||
                                   isEqual(left, right.right))) {
            return left;
        }

        if(left.type == 'and' && (isEqual(left.left, right) || 
                                  isEqual(left.right, right))) {
            return right;
        }
    }

    return {
        type: node.type,
        left: left,
        right: right
    };

}

/**
 * Преобразует дерево в текст логического выражения.
 * Учитывает приоритеты операторов.
 * 
 * @param {Node} node Корень преобразуемого дерева
 * @param {number} [parentPriority = 5] Приоритет родительской операции 
 * @returns {string} Текстовое представление логического выражения
 */
function nodeToExpression(node, parentPriority = 5) {
    let priority;
    let text;

    switch (node.type) {
        case 'operand':
            priority = 1;
            text = node.value;
            break;

        case 'constant':
            priority = 1;
            text = node.value ? 'true' : 'false';
            break;

        case 'not':
            priority = 2;
            text = `!${nodeToExpression(node.child, priority)}`;
            break;

        case 'and':
            priority = 3;
            text = `${nodeToExpression(node.left, priority)} && ${nodeToExpression(node.right, priority)}`;
            break;

        case 'or':
            priority = 4;
            text = `${nodeToExpression(node.left, priority)} || ${nodeToExpression(node.right, priority)}`;
            break;

        default:
            return '';
    }

    if(priority > parentPriority) {
        return `(${text})`;
    }

    return text;
}

module.exports = {
    splitting,
    parsePrimary,
    parseExpression,
    parseAnd,
    parseOr,
    simplifyNode,
    nodeToExpression
 };