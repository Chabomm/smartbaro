import React, { useState, useEffect } from 'react';
import { cls } from '@/libs/utils';
import { api } from '@/libs/axios';

export default function FolderTree(props: any) {
    const [filesInFolder, setFilesInFolder] = useState<any>({});
    useEffect(() => {
        setFilesInFolder(props.data);
    }, [props]);

    const [opend, setOpend] = useState(false);
    const handleSetIndex = () => {
        setOpend(!opend);
    };

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, d: any) => {
        try {
            const { name, value } = e.target;
            let files: any = e.target.files;

            // files 때문에 모든 데이터를 formData로 변경해서 넣어준다
            const formData = new FormData();
            for (var i = 0; i < files.length; i++) {
                formData.append('files', files[i]);
            }
            formData.append('folder', d.real);

            const { data } = await api.post(`/be/admin/setup/images/folders/upload`, formData, { headers: { 'Content-Type': 'multipart/form-data' } });

            if (data.code == 200) {
                alert(data.msg);
                const copy: any = { ...filesInFolder };
                for (var i = 0; i < data.upload_list.length; i++) {
                    copy.dir.push(data.upload_list[i]);
                }
                setFilesInFolder(copy);
            } else {
                alert(data.msg);
            }

            e.target.value = '';
        } catch (e: any) {}
    };

    const openImageViewer = (path: any) => {
        window.open(`/setup/images/view?path=${encodeURIComponent(path)}`, '이미지 뷰어', 'width=900,height=1000,location=no,status=no,scrollbars=yes');
    };

    const fnCopiedPath = path => {
        let t = document.createElement('textarea');
        document.body.appendChild(t);
        t.value = path;
        t.select();
        document.execCommand('copy');
        document.body.removeChild(t);
        alert('링크가 복사되었습니다.');
    };

    const handleFileDelete = async (path: any) => {
        try {
            if (!confirm('파일삭제하면 복구는 불가하며, 프론트에 해당 이미지를 사용중인 경우 엑박 처리가 됩니다. 계속하시겠습니까 ?')) {
                return;
            }

            const { data } = await api.post(`/be/admin/setup/images/folders/delete`, { path: path });
            if (data.code == 200) {
                alert(data.msg);
                const copy: any = { ...filesInFolder };
                let temp_dir: any = [];
                for (var i = 0; i < copy.dir.length; i++) {
                    if (copy.dir[i].real != path) {
                        temp_dir.push(copy.dir[i]);
                    }
                }
                copy.dir = temp_dir;
                setFilesInFolder(copy);
            } else {
                alert(data.msg);
            }
        } catch (e: any) {
            console.log(e);
        }
    };

    return (
        <>
            <div className="mb-3 p-1 hover:bg-slate-200">
                <div onClick={handleSetIndex} className="cursor-pointer flex items-center leading-none">
                    <i className={cls('far me-3', opend ? 'fa-folder-open' : 'fa-folder')}></i>
                    <div className="me-3">{filesInFolder?.name}</div>
                    <div className={cls('flex items-center justify-center transition', opend ? 'rotate-180' : '')}>
                        <i className="fas fa-angle-down"></i>
                    </div>
                    <label className="ms-auto">
                        업로드 <i className="fas fa-cloud-upload-alt"></i>
                        <input
                            name="files"
                            type="file"
                            className="hidden"
                            accept="image/*"
                            multiple
                            onChange={e => {
                                handleFileUpload(e, filesInFolder);
                            }}
                        />
                    </label>
                </div>
            </div>

            {opend && filesInFolder.dir.length > 0 && (
                <div className="pl-5">
                    {filesInFolder.dir.map((v, i) => {
                        if (v.type == 'folder') {
                            return <FolderTree key={i} data={v}></FolderTree>;
                        } else {
                            return (
                                <div className="mb-4 sub_dir flex items-center hover:bg-slate-200" key={i}>
                                    <div className="w-9 h-9 ms-2 me-4 flex items-center overflow-hidden">
                                        <img
                                            src={v.path}
                                            onClick={() => {
                                                openImageViewer(v.path);
                                            }}
                                            className="w-full"
                                        />
                                    </div>
                                    <span
                                        onClick={() => {
                                            fnCopiedPath(v.path);
                                        }}
                                        className="font-semibold cursor-pointer"
                                    >
                                        {v.path}
                                    </span>
                                    <span
                                        className="mx-3 text-red-500 cursor-pointer"
                                        onClick={() => {
                                            handleFileDelete(v.real);
                                        }}
                                    >
                                        <i className="far fa-times-circle font-bold"></i>
                                    </span>
                                </div>
                            );
                        }
                    })}
                </div>
            )}
        </>
    );
}
