namespace egret3d {
    /**
     * 
     */
    export class Mesh extends BaseMesh {
        /**
         * @internal
         */
        public readonly ibos: WebGLBuffer[] = [];
        /**
         * @internal
         */
        public vbo: WebGLBuffer | null = null;

        public dispose() {
            if (this._isBuiltin) {
                return;
            }

            const webgl = WebGLCapabilities.webgl;

            for (const ibo of this.ibos) {
                webgl.deleteBuffer(ibo);
            }

            if (this.vbo) {
                webgl.deleteBuffer(this.vbo);
            }

            super.dispose();

            this.ibos.length = 0;
            this.vbo = null;
        }

        public createBuffer() {
            if (this.vbo) {
                return;
            }

            this.vbo = true;

            const vertexBufferViewAccessor = this.getAccessor(0);
            const vertexBuffer = this.createTypeArrayFromBufferView(this.getBufferView(vertexBufferViewAccessor), gltf.ComponentType.Float);
            const webgl = WebGLCapabilities.webgl;
            const vbo = webgl.createBuffer();

            if (vbo) {
                this.vbo = vbo;

                const attributeNames: gltf.MeshAttribute[] = [];
                for (const k in this._glTFMesh!.primitives[0].attributes) {
                    attributeNames.push(k);
                }

                let subMeshIndex = 0;
                for (const primitive of this._glTFMesh!.primitives) {
                    if (primitive.indices !== undefined) {
                        if (this.ibos.length === subMeshIndex) {
                            const ibo = webgl.createBuffer();
                            if (ibo) {
                                this.ibos.push(ibo);
                                webgl.bindBuffer(webgl.ELEMENT_ARRAY_BUFFER, ibo);
                                webgl.bufferData(webgl.ELEMENT_ARRAY_BUFFER, this.getBufferLength(this.getAccessor(primitive.indices)), this.drawMode);
                                this.uploadSubIndexBuffer(subMeshIndex);
                            }
                            else {
                                console.error("Create webgl element buffer error.");
                            }
                        }
                        else {
                            console.error("Error arguments.");
                        }
                    }
                    else if (this.ibos.length > 0) {
                        console.error("Error arguments.");
                    }

                    subMeshIndex++;
                }

                webgl.bindBuffer(webgl.ARRAY_BUFFER, this.vbo);
                webgl.bufferData(webgl.ARRAY_BUFFER, vertexBuffer.byteLength, this.drawMode);
                this.uploadVertexBuffer(attributeNames);
            }
            else {
                console.error("Create webgl buffer error.");
            }
        }
        /**
         * 
         */
        public uploadVertexBuffer(uploadAttributes: gltf.MeshAttribute | (gltf.MeshAttribute[]), offset: number = 0, count: number = 0) {
            if (!this.vbo) {
                return;
            }

            const webgl = WebGLCapabilities.webgl;
            const { attributes } = this._glTFMesh!.primitives[0];

            webgl.bindBuffer(webgl.ARRAY_BUFFER, this.vbo);

            if (Array.isArray(uploadAttributes)) {
                for (const attributeName of uploadAttributes) {
                    const accessorIndex = attributes[attributeName];
                    if (accessorIndex !== undefined) {
                        const accessor = this.getAccessor(accessorIndex);
                        const bufferOffset = this.getBufferOffset(accessor);
                        const subVertexBuffer = this.createTypeArrayFromAccessor(accessor, offset, count);
                        webgl.bufferSubData(webgl.ARRAY_BUFFER, bufferOffset, subVertexBuffer);
                    }
                    else {
                        console.warn("Error arguments.");
                    }
                }
            }
            else {
                const accessorIndex = attributes[uploadAttributes];
                if (accessorIndex !== undefined) {
                    const accessor = this.getAccessor(accessorIndex);
                    const bufferOffset = this.getBufferOffset(accessor);
                    const subVertexBuffer = this.createTypeArrayFromAccessor(accessor);
                    webgl.bufferSubData(webgl.ARRAY_BUFFER, bufferOffset, subVertexBuffer);
                }
                else {
                    console.warn("Error arguments.");
                }
            }
        }
        /**
         * 
         */
        public uploadSubIndexBuffer(subMeshIndex: number = 0) {
            if (0 <= subMeshIndex && subMeshIndex < this._glTFMesh!.primitives.length) {
                if (!this.vbo) {
                    return;
                }

                const webgl = WebGLCapabilities.webgl;
                const primitive = this._glTFMesh!.primitives[subMeshIndex];

                if (primitive.indices !== undefined) {
                    const accessor = this.getAccessor(primitive.indices);
                    const subIndexBuffer = this.createTypeArrayFromAccessor(accessor);
                    const ibo = this.ibos[subMeshIndex];
                    webgl.bindBuffer(webgl.ELEMENT_ARRAY_BUFFER, ibo);
                    webgl.bufferSubData(webgl.ELEMENT_ARRAY_BUFFER, 0, subIndexBuffer);
                }
                else {
                    console.warn("Error arguments.");
                }
            }
            else {
                console.warn("Error arguments.");
            }
        }
    }
}