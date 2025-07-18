import { ref, nextTick, watch } from 'vue'

export function useMarkerBalloon(mapStore, ymapRef, containerRef) {
    // --- Состояния ---
    const isEditMarkerOpen = ref(false)
    const editingMarker = ref(null)
    const changeCoordsMode = ref(false)
    const markerToMove = ref(null)
    const coordsHint = ref('')

    // --- Генерация HTML для вложения ---
    function getAttachmentHtml(att) {
        const ext = att.name ? att.name.split('.').pop().toLowerCase() : ''
        if (['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp'].includes(ext)) {
            return `<div style='margin:4px 0;'><img src='${att.url}' alt='${att.name}' style='max-width:80px;max-height:80px;display:block;border-radius:4px;border:1px solid #ccc;'/><div style='font-size:12px;'>${att.name}</div></div>`
        } else if (ext === 'pdf') {
            return `<div style='margin:4px 0;'><span style='color:#e53935;font-weight:bold;'>[PDF]</span> <a href='${att.url}' target='_blank'>${att.name}</a></div>`
        } else {
            return `<div style='margin:4px 0;'><span style='color:#888;'>[Файл]</span> <a href='${att.url}' target='_blank'>${att.name}</a></div>`
        }
    }

    // --- Генерация контента балуна ---
    function getBalloonContent(marker) {
        let attachmentsHtml = ''
        if (marker.attachments && marker.attachments.length) {
            attachmentsHtml = `<div><b>Вложения:</b><div>${marker.attachments.map(getAttachmentHtml).join('')}</div></div>`
        }
        return `
      <div style='min-width:220px;'>
        <div style='font-weight:bold;font-size:16px;'>${marker.label || ''}</div>
        <div style='margin:8px 0;'><b>Описание:</b> ${marker.hint || ''}</div>
        <div style='margin:8px 0;'><b>Координаты:</b> ${marker.coords ? marker.coords[0].toFixed(6) + ', ' + marker.coords[1].toFixed(6) : ''}</div>
        ${attachmentsHtml}
        <button data-marker-id='${marker.id}' class='edit-marker-btn' style='margin-top:8px;padding:4px 12px;'>Редактировать</button>
      </div>
    `
    }

    // --- Открытие редактора маркера ---
    function startEditMarker(marker) {
        editingMarker.value = {...marker }
        isEditMarkerOpen.value = true
    }

    // --- Закрытие редактора маркера ---
    function stopEditMarker() {
        isEditMarkerOpen.value = false
        editingMarker.value = null
    }

    // --- Сохранение изменений маркера ---
    function saveMarkerEdit() {
        const idx = mapStore.markers.findIndex(m => m.id == editingMarker.value.id)
        if (idx !== -1) {
            mapStore.markers[idx] = {...editingMarker.value }
        }
        stopEditMarker()
    }

    // --- Смена координат ---
    function startChangeCoords() {
        markerToMove.value = editingMarker.value
        changeCoordsMode.value = true
        coordsHint.value = 'Кликните по карте для выбора новой позиции маркера'
        nextTick(() => {
            if (ymapRef.value && ymapRef.value.ymap) {
                ymapRef.value.ymap.balloon.close()
            }
            if (containerRef.value) containerRef.value.classList.add('select-coords-mode')
        })
        isEditMarkerOpen.value = false
    }

    function onMapClick(e, allMarkers) {
        if (changeCoordsMode.value && markerToMove.value) {
            const coords = getMapCoordsFromEvent(e)
            if (coords) {
                markerToMove.value.coords = coords
                const idx = mapStore.markers.findIndex(m => m.id == markerToMove.value.id)
                if (idx !== -1) mapStore.markers[idx].coords = coords
                editingMarker.value = {...markerToMove.value }
                isEditMarkerOpen.value = true
            }
            changeCoordsMode.value = false
            markerToMove.value = null
            coordsHint.value = ''
            if (containerRef.value) containerRef.value.classList.remove('select-coords-mode')
        }
    }

    // --- Работа с вложениями ---
    function handleFileInput(e, marker) {
        const files = Array.from(e.target.files)
        if (!marker.attachments) marker.attachments = []
        files.forEach(file => {
            const url = URL.createObjectURL(file)
            marker.attachments.push({ name: file.name, url, file })
        })
        e.target.value = ''
    }

    function removeAttachment(marker, idx) {
        if (marker.attachments) marker.attachments.splice(idx, 1)
    }

    // --- Вспомогательное для получения координат из события ---
    function getMapCoordsFromEvent(e) {
        return (e && typeof e.get === 'function') ? e.get('coords') : null
    }

    // --- Защита от ложного открытия попапа ---
    watch(isEditMarkerOpen, (val) => {
        if (val && !editingMarker.value) {
            isEditMarkerOpen.value = false
        }
    })

    return {
        isEditMarkerOpen,
        editingMarker,
        changeCoordsMode,
        markerToMove,
        coordsHint,
        getBalloonContent,
        startEditMarker,
        stopEditMarker,
        saveMarkerEdit,
        startChangeCoords,
        onMapClick,
        handleFileInput,
        removeAttachment
    }
}