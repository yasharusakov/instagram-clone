import {useActions} from "../../../hooks/useActions"
import {useAppSelector} from "../../../hooks/useAppSelector"
import {FormEvent, useEffect, useState} from "react"

import './style.scss'

const AdditionalMediaPopup = () => {
    const {setPopup} = useActions()
    const data = useAppSelector(state => state.popups.AdditionalMedia.data)
    const [edit, setEdit] = useState<boolean>(false)
    const [loading, setLoading] = useState<boolean>(false)
    const [signature, setSignature] = useState<string>(data?.signatureValueDefault || '')

    useEffect(() => {

        if (data?.signatureValueDefault) {
            setSignature(data.signatureValueDefault)
        }

        return () => {
            setEdit(false)
        }
    }, [data])

    const onSubmitHandler = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        if (data?.signatureValueDefault === signature) return

        setLoading(true)

        data.editSignature(signature)

        setLoading(false)
    }

    return (
        <div className="additional-media-popup">
            <div className="additional-media-popup__container">
                {
                    edit ? (
                        <form onSubmit={onSubmitHandler} className="additional-media-popup__edit">
                            <textarea onChange={(e) => setSignature(e.target.value)} value={signature} placeholder="Добавьте подпись" className="additional-media-popup__edit"></textarea>
                            <div className="additional-media-popup__edit__buttons" >
                                <button disabled={loading} onClick={() => setEdit(false)} className="additional-media-popup__edit__button-cancel">Отменить</button>
                                <button disabled={loading} type="submit" className="additional-media-popup__edit__button-submit">Изменить подпись</button>
                            </div>
                        </form>
                    ) : (
                        <>
                            {
                                data?.amI ? (
                                    <>
                                        <button onClick={() => data.deleteMedia()} className="additional-media-popup__button additional-media-popup__button_red">Удалить</button>
                                        <button onClick={() => setEdit(true)} className="additional-media-popup__button">Редактировать</button>
                                    </>
                                ) : (
                                    <button onClick={() => data.redirectToMedia()} className="additional-media-popup__button">Перейти к публикации</button>
                                )
                            }
                            <button onClick={() => setPopup({name: 'AdditionalMedia', type: false, data: null})} className="additional-media-popup__button">Отмена</button>
                        </>
                    )
                }
            </div>
        </div>
    )
}

export default AdditionalMediaPopup